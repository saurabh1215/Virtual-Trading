const Axios = require("axios");
const data = require("../config/stocksData");

const tickerBasePrices = {
  AAPL: 185.00,
  AMZN: 175.50,
  GOOG: 165.20,
  MSFT: 415.00,
  WMT: 65.40,
  INTC: 31.20,
  AXP: 220.00,
  BA: 180.00,
  CSCO: 48.50,
  GS: 440.00,
  JNJ: 150.00,
  KO: 62.00,
  MCD: 270.00,
  NKE: 95.00,
  PG: 160.00,
  VZ: 40.00,
  CRM: 280.00,
  V: 275.00,
  UNH: 520.00,
  IBM: 170.00,
  CVX: 155.00,
};

function getMockBasePrice(ticker) {
  const symbol = (ticker || "").toUpperCase();
  if (tickerBasePrices[symbol]) {
    return tickerBasePrices[symbol];
  }
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 100 + Math.abs(hash % 150);
}

function generateMockHistoricData(ticker) {
  const basePrice = getMockBasePrice(ticker);
  const now = new Date();
  const rawData = [];

  for (let i = 500; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    // For the last 30 items (intraday sessions), space them across trading hours (9:30 AM - 4:00 PM)
    if (i < 30) {
      const tradingHourOffset = 9 + Math.floor(((30 - i) % 7) * 1.1);
      const tradingMinuteOffset = ((30 - i) * 25) % 60;
      d.setHours(tradingHourOffset, tradingMinuteOffset, 0, 0);
    } else {
      d.setHours(16, 0, 0, 0);
    }

    const wave = Math.sin(i / 15) * (basePrice * 0.08) + Math.cos(i / 40) * (basePrice * 0.12);
    const trend = ((500 - i) / 500) * (basePrice * 0.15);
    const adjClose = Math.round((basePrice + wave + trend + Number.EPSILON) * 100) / 100;
    const volBase = Math.round(1500000 + Math.abs(Math.sin(i / 7) * 2000000) + (basePrice * 1000));

    rawData.push({
      date: d.toISOString(),
      adjClose,
      adjOpen: Math.round((adjClose * 0.995 + Number.EPSILON) * 100) / 100,
      adjHigh: Math.round((adjClose * 1.01 + Number.EPSILON) * 100) / 100,
      adjLow: Math.round((adjClose * 0.99 + Number.EPSILON) * 100) / 100,
      adjVolume: volBase,
    });
  }


  const pastMonth = rawData.slice(-25).map(item => ({
    date: item.date,
    adjClose: item.adjClose,
    adjVolume: item.adjVolume,
  }));

  const pastTwoYears = rawData.map(item => ({
    date: item.date,
    adjClose: item.adjClose,
    adjVolume: item.adjVolume,
  }));

  const sixMonthAverages = [];
  let currentMonthIndex = now.getMonth();
  for (let i = 0; i < 6; i++) {
    const monthNum = (currentMonthIndex - i + 12) % 12;
    const itemsInMonth = rawData.filter(item => new Date(item.date).getMonth() === monthNum);
    const avg = itemsInMonth.length > 0
      ? itemsInMonth.reduce((acc, curr) => acc + curr.adjClose, 0) / itemsInMonth.length
      : basePrice;
    sixMonthAverages.push({
      value: Math.round((avg + Number.EPSILON) * 100) / 100,
      month: monthNum
    });
  }
  sixMonthAverages.reverse();

  const lastDay = rawData[rawData.length - 1];

  return {
    status: "success",
    pastDay: {
      date: lastDay.date,
      adjClose: lastDay.adjClose,
      adjOpen: lastDay.adjOpen,
      adjHigh: lastDay.adjHigh,
      adjLow: lastDay.adjLow,
      adjVolume: lastDay.adjVolume,
    },
    pastMonth,
    pastTwoYears,
    sixMonthAverages,
    fullData: rawData,
  };
}


exports.getStockMetaData = async (req, res) => {
  try {
    const apiKey = process.env.TIINGO_API_KEY;
    if (!apiKey) throw new Error("No Tiingo API Key");
    const url = `https://api.tiingo.com/tiingo/daily/${req.params.ticker}?token=${apiKey}`;
    const response = await Axios.get(url);
    return res.status(200).json({ status: "success" , data:response.data,});
  } catch (error) {
    let info;
    data.stockData.forEach((stock) => {
      if (stock.ticker.toLowerCase() === req.params.ticker.toLowerCase()) {
        info = stock;
      }
    });
    return res.status(200).json({ status: "success", data: info || { name: req.params.ticker, ticker: req.params.ticker } });
  }
};

exports.getStockInfo = (req, res) => {
  let info;
  data.stockData.forEach((stock) => {
    if (stock.ticker.toLowerCase() === req.params.ticker.toLowerCase()) {
      info = stock;
    }
  });

  if (info) {
    return res.status(200).json({status: "success", data: info,});
  } else {
    return res.status(200).json({status: "fail",});
  }
};

exports.getStockHistoricData = async (req, res) => {
  try {
    const apiKey = process.env.TIINGO_API_KEY;
    if (!apiKey) throw new Error("No Tiingo API key");

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');

    const url = `https://api.tiingo.com/tiingo/daily/${req.params.ticker}/prices?startDate=${year}-${month}-${day}&token=${apiKey}`;



    const response = await Axios.get(url);
    const data = response.data;

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned from Tiingo");
    }

    const pastMonth = [];
    const count = Math.min(25, data.length);
    for (let i = 0; i < count; i++) {
      pastMonth.push({date: data[data.length - 1 - i].date , adjClose: data[data.length - 1 - i].adjClose,});
    }

    const sixMonthAverages = [];
    let latestMonth = new Date(data[data.length - 1].date).getMonth();
    let index = data.length - 1;

    for (let i = 0; i < 6; i++) {
      if (index < 0) break;
      let monthAverage = data[index].adjClose;
      let dataPoints = 1;
      index -= 1;
      while (index >= 0 && new Date(data[index].date).getMonth() === latestMonth) {
        monthAverage += data[index].adjClose;
        dataPoints += 1;
        index -= 1;
      }

      sixMonthAverages.push({
        value: Math.round((monthAverage / dataPoints + Number.EPSILON) * 100) / 100,
        month: latestMonth,
      });
      if (index >= 0) {
        latestMonth = new Date(data[index].date).getMonth();
      }
    }

    const pastTwoYears = [];
    for (let i = data.length - 1; i >= 0; i -= 5) {
      pastTwoYears.push({
        date: data[i].date,
        adjClose: Math.round((data[i].adjClose + Number.EPSILON) * 100) / 100,
      });
    }

    sixMonthAverages.reverse();
    pastMonth.reverse();
    pastTwoYears.reverse();

    return res.status(200).json({ status: "success",
      pastDay: {
        date: data[data.length - 1].date,
        adjClose: data[data.length - 1].adjClose,
        adjOpen: data[data.length - 1].adjOpen,
        adjHigh: data[data.length - 1].adjHigh,
        adjLow: data[data.length - 1].adjLow,
      },
      pastMonth,
      pastTwoYears,
      sixMonthAverages,
    });

  } catch (error) {
    const statusMsg = error.response ? `HTTP ${error.response.status}` : error.message;
    console.log(`⚠️ Tiingo API Rate Limit / Error for ${req.params.ticker} (${statusMsg}) -> Switching to Mock Simulation Mode`);
    return res.status(200).json(generateMockHistoricData(req.params.ticker));
  }

};

const getRandomTicker = () => {
  const randomIndex = Math.floor(
    Math.random() * Math.floor(data.stockData.length)
  );
  return {
    ticker: data.stockData[randomIndex].ticker,
    name: data.stockData[randomIndex].name,
  };
};

exports.getRandomStockData = async (req, res) => {
  try {
    const stock = getRandomTicker();
    const apiKey = process.env.TIINGO_API_KEY;
    if (!apiKey) throw new Error("No Tiingo API key");

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 3);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();

    const url = `https://api.tiingo.com/tiingo/daily/${stock.ticker}/prices?startDate=${year}-${month}-${day}&token=${apiKey}`;

    const response = await Axios.get(url);

    const data = [];
    for (let i = response.data.length - 1; i >= 0; i -= 5) {
      data.push({
        date: response.data[i].date,
        adjClose:
          Math.round((response.data[i].adjClose + Number.EPSILON) * 100) / 100,
      });
    }

    data.reverse();

    return res.status(200).json({  status: "success",  ticker: stock.ticker, name: stock.name, data,  });
  } catch (error) {
    const stock = getRandomTicker();
    const mockData = generateMockHistoricData(stock.ticker);
    return res.status(200).json({ status: "success", ticker: stock.ticker, name: stock.name, data: mockData.pastTwoYears });
  }
};

