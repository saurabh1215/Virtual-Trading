const mongoose = require("mongoose");
const User = require("../models/userModel");
const Stock = require("../models/stockModel");
const data = require("../config/stocksData");
const Axios = require("axios");

exports.purchaseStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId, ticker, quantity, price } = req.body;

    if (req.user !== userId) {
      return res.status(200).json({ status: "fail", message: "Credentials couldn't be validated." });
    }

    let resultUser;
    let purchaseId;
    let customError = null;

    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);

      if (!user) {
        customError = { status: 200, json: { status: "fail", message: "Credentials couldn't be validated." } };
        return;
      }

      const totalPrice = quantity * price;
      if (user.balance < totalPrice) {
        customError = { status: 200, json: { status: "fail", message: `You don't have enough cash to purchase this stock.` } };
        return;
      }

      const purchase = new Stock({ userId, ticker, quantity, price });
      await purchase.save({ session });

      const newBalance = Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { balance: newBalance },
        { session, new: true }
      );

      resultUser = updatedUser;
      purchaseId = purchase._id;
    });

    if (customError) {
      return res.status(customError.status).json(customError.json);
    }

    return res.status(200).json({
      status: "success",
      stockId: purchaseId,
      user: {
        username: resultUser.username,
        id: resultUser._id,
        balance: resultUser.balance,
      },
    });
  } catch (error) {
    return res.status(200).json({ status: "fail", message: "Something unexpected happened." });
  } finally {
    await session.endSession();
  }
};

exports.buyStock = exports.purchaseStock;

exports.sellStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId, stockId, quantity, price } = req.body;

    if (req.user !== userId) {
      return res.status(200).json({ status: "fail", message: "Credentials couldn't be validated." });
    }

    let resultUser;
    let customError = null;

    await session.withTransaction(async () => {
      const stock = await Stock.findById(stockId).session(session);

      if (!stock) {
        customError = { status: 200, json: { status: "fail", message: "Credentials couldn't be validated." } };
        return;
      }

      const user = await User.findById(userId).session(session);

      if (!user) {
        customError = { status: 200, json: { status: "fail", message: "Credentials couldn't be validated." } };
        return;
      }

      if (quantity > stock.quantity) {
        customError = { status: 200, json: { status: "fail", message: "Invalid quantity." } };
        return;
      }

      if (quantity === stock.quantity) {
        await Stock.findByIdAndDelete(stockId, { session });
      } else {
        await Stock.findByIdAndUpdate(
          stockId,
          { quantity: stock.quantity - quantity },
          { session }
        );
      }

      const saleProfit = quantity * price;
      const newBalance = Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { balance: newBalance },
        { session, new: true }
      );

      resultUser = updatedUser;
    });

    if (customError) {
      return res.status(customError.status).json(customError.json);
    }

    return res.status(200).json({
      status: "success",
      user: {
        username: resultUser.username,
        id: resultUser._id,
        balance: resultUser.balance,
      },
    });
  } catch (error) {
    return res.status(200).json({ status: "fail", message: "Something unexpected happened." });
  } finally {
    await session.endSession();
  }
};

const tickerBasePrices = {
  AAPL: 185.00, AMZN: 175.50, GOOG: 165.20, MSFT: 415.00, WMT: 65.40, INTC: 31.20,
  AXP: 220.00, BA: 180.00, CSCO: 48.50, GS: 440.00, JNJ: 150.00, KO: 62.00,
  MCD: 270.00, NKE: 95.00, PG: 160.00, VZ: 40.00, CRM: 280.00, V: 275.00,
  UNH: 520.00, IBM: 170.00, CVX: 155.00,
};

const getPricesData = async (stocks) => {
  try {
    const apiKey = process.env.TIINGO_API_KEY;
    if (!apiKey) throw new Error("No Tiingo API key");
    const promises = stocks.map(async (stock) => {
      const url = `https://api.tiingo.com/tiingo/daily/${stock.ticker}/prices?token=${apiKey}`;
      const response = await Axios.get(url);
      return { ticker: stock.ticker, date: response.data[0].date, adjClose: response.data[0].adjClose, };
    });
    return await Promise.all(promises);
  } catch (error) {
    const today = new Date().toISOString();
    return stocks.map((stock) => {
      const symbol = (stock.ticker || "").toUpperCase();
      const base = tickerBasePrices[symbol] || stock.price || 150;
      return { ticker: stock.ticker, date: today, adjClose: base };
    });
  }
};

exports.getStockForUser = async (req, res) => {
  try {
    if (req.user !== req.params.userId) {
      return res.status(200).json({  status: "fail", message: "Credentials couldn't be validated.", });
    }
    // console.log("ssokk");
    const stocks = await Stock.find({ userId: req.params.userId });
    // console.log("Stokes",stocks);
    const stocksData = await getPricesData(stocks); 
    console.log("okk");
    const modifiedStocks = stocks.map((stock) => {
      let name,currentPrice,currentDate;
      data.stockData.forEach((stockData) => {
        if (stockData.ticker.toLowerCase() === stock.ticker.toLowerCase()) {
          name = stockData.name;
        }
      });

      stocksData.forEach((stockData) => {
        if (stockData.ticker.toLowerCase() === stock.ticker.toLowerCase()) {
          currentDate = stockData.date;
          currentPrice = stockData.adjClose;
        }
      });

      return {
        id: stock._id,
        ticker: stock.ticker,
        name,
        purchasePrice: stock.price,
        purchaseDate: stock.date,
        quantity: stock.quantity,
        currentDate,
        currentPrice,
      };
    });
   console.log(modifiedStocks);
    return res.status(200).json({ status: "success", stocks: modifiedStocks, });
  } catch (error) {
    return res.status(200).json({ status: "fail",  message: "Something unexpected happened.", });
  }
};

exports.resetAccount = async (req, res) => {
  try {
    if (req.user !== req.params.userId) {
      return res.status(200).json({ status: "fail", message: "Credentials couldn't be validated.", });
    }

    const stocks = await Stock.find({ userId: req.params.userId });
    stocks.forEach(async (stock) => {
      await Stock.findByIdAndDelete(stock._id);
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      balance: 100000,
    });

    return res.status(200).json({ status: "success",
      user: {
        username: updatedUser.username,
        id: updatedUser._id,
        balance: 100000,
      },
    });
  } catch (error) {
    return res.status(200).json({ status: "fail", message: "Something unexpected happened.", });
  }
};
