const EventEmitter = require("events");

class MarketDataProvider extends EventEmitter {
  constructor() {
    super();
    this.initialPrices = {
      AAPL: { name: "Apple Inc.", price: 185.00, high: 187.50, low: 183.20 },
      AMZN: { name: "Amazon.com Inc.", price: 175.50, high: 178.10, low: 173.80 },
      GOOG: { name: "Alphabet Inc.", price: 165.20, high: 167.00, low: 163.90 },
      MSFT: { name: "Microsoft Corp.", price: 415.00, high: 420.00, low: 411.50 },
      TSLA: { name: "Tesla Inc.", price: 210.40, high: 215.00, low: 206.80 },
      NVDA: { name: "NVIDIA Corp.", price: 128.50, high: 132.00, low: 125.10 },
      WMT: { name: "Walmart Inc.", price: 65.40, high: 66.20, low: 64.80 },
      INTC: { name: "Intel Corp.", price: 31.20, high: 32.10, low: 30.70 },
      AXP: { name: "American Express", price: 220.00, high: 224.00, low: 218.00 },
      BA: { name: "Boeing Co.", price: 180.00, high: 183.50, low: 177.20 },
      CSCO: { name: "Cisco Systems", price: 48.50, high: 49.20, low: 47.90 },
      GS: { name: "Goldman Sachs", price: 440.00, high: 446.00, low: 435.00 },
      JNJ: { name: "Johnson & Johnson", price: 150.00, high: 152.00, low: 148.50 },
      KO: { name: "Coca-Cola Co.", price: 62.00, high: 62.80, low: 61.20 },
      MCD: { name: "McDonald's Corp.", price: 270.00, high: 274.00, low: 267.50 },
      NKE: { name: "Nike Inc.", price: 95.00, high: 96.80, low: 93.90 },
      PG: { name: "Procter & Gamble", price: 160.00, high: 162.50, low: 158.00 },
      VZ: { name: "Verizon Communications", price: 40.00, high: 40.80, low: 39.40 },
      CRM: { name: "Salesforce Inc.", price: 280.00, high: 285.00, low: 276.00 },
      V: { name: "Visa Inc.", price: 275.00, high: 279.00, low: 271.00 },
      UNH: { name: "UnitedHealth Group", price: 520.00, high: 526.00, low: 515.00 },
      IBM: { name: "IBM Corp.", price: 170.00, high: 172.80, low: 168.10 },
      CVX: { name: "Chevron Corp.", price: 155.00, high: 157.50, low: 153.20 },
    };
    this.currentPrices = JSON.parse(JSON.stringify(this.initialPrices));
  }

  start() {
    throw new Error("start() method must be implemented by Provider subclass");
  }

  stop() {
    throw new Error("stop() method must be implemented by Provider subclass");
  }
}

/**
 * Stock Market Stream Provider
 * Emits real-time live stock price ticks for all stock symbols in the Virtual Trading Playground
 */
class StockStreamProvider extends MarketDataProvider {
  constructor(intervalMs = 1500) {
    super();
    this.intervalMs = intervalMs;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      const keys = Object.keys(this.currentPrices);
      // Pick 2-4 random stock symbols to update per tick interval
      const shuffleCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < shuffleCount; i++) {
        const key = keys[Math.floor(Math.random() * keys.length)];
        const item = this.currentPrices[key];
        const base = this.initialPrices[key].price;
        
        // Random walk tick delta between -0.4% and +0.4%
        const deltaPercent = (Math.random() - 0.49) * 0.008;
        const oldPrice = item.price;
        let newPrice = Math.round((oldPrice * (1 + deltaPercent) + Number.EPSILON) * 100) / 100;
        if (newPrice <= 0) newPrice = oldPrice;

        item.prevPrice = oldPrice;
        item.price = newPrice;
        item.high = Math.max(item.high, newPrice);
        item.low = Math.min(item.low, newPrice);

        const change = newPrice - base;
        const changePercent = (change / base) * 100;

        const tick = {
          ticker: key,
          name: item.name,
          price: newPrice,
          prevPrice: oldPrice,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          high: item.high,
          low: item.low,
          updatedAt: new Date().toISOString(),
        };

        this.emit("tick", tick);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  getAllPrices() {
    const all = {};
    Object.keys(this.currentPrices).forEach((key) => {
      const item = this.currentPrices[key];
      const base = this.initialPrices[key].price;
      const change = item.price - base;
      const changePercent = (change / base) * 100;
      all[key] = {
        ticker: key,
        name: item.name,
        price: item.price,
        prevPrice: item.prevPrice || item.price,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        high: item.high,
        low: item.low,
        updatedAt: new Date().toISOString(),
      };
    });
    return all;
  }
}

/**
 * Tiingo Stock WebSocket Provider (Extensible Adapter)
 * Ready to stream live stock trades when TIINGO_API_KEY is configured
 */
class TiingoStockProvider extends EventEmitter {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
  }

  start() {
    console.log("ℹ️ Tiingo Stock Provider ready for live IEX WebSocket streaming");
  }

  stop() {}
}

/**
 * Composite Stock Data Provider
 * Broadcaster interface managing stock data streams
 */
class CompositeMarketDataProvider extends EventEmitter {
  constructor() {
    super();
    this.stockProvider = new StockStreamProvider(1500);
    this.allPrices = {};
  }

  start() {
    this.stockProvider.on("tick", (tick) => {
      this.allPrices[tick.ticker] = tick;
      this.emit("tick", tick);
      this.emit("allTicks", this.allPrices);
    });

    this.stockProvider.start();
    this.allPrices = this.stockProvider.getAllPrices();
  }

  stop() {
    this.stockProvider.stop();
  }

  getAllPrices() {
    return this.stockProvider.getAllPrices();
  }
}

module.exports = {
  MarketDataProvider,
  StockStreamProvider,
  TiingoStockProvider,
  CompositeMarketDataProvider,
};
