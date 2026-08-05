const { Server } = require("socket.io");
const { CompositeMarketDataProvider } = require("./marketDataProvider");

let io = null;
let provider = null;

function initSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  provider = new CompositeMarketDataProvider();

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.io: ${socket.id}`);

    // Send current initial snapshot of all stock prices immediately
    socket.emit("initial-prices", provider.getAllPrices());

    // Allow client to request price for specific stock
    socket.on("subscribe-ticker", (symbol) => {
      if (symbol) {
        socket.join(`ticker:${symbol.toUpperCase()}`);
      }
    });

    socket.on("unsubscribe-ticker", (symbol) => {
      if (symbol) {
        socket.leave(`ticker:${symbol.toUpperCase()}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Listen for provider price ticks and broadcast generically to Socket.io clients
  provider.on("tick", (tick) => {
    if (io) {
      io.emit("price-tick", tick);
      io.to(`ticker:${tick.ticker.toUpperCase()}`).emit("single-tick", tick);
    }
  });

  provider.start();

  console.log("⚡ Socket.io live market broadcaster service initialized");
  return { io, provider };
}

module.exports = {
  initSocketServer,
  getIO: () => io,
};
