import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [livePrices, setLivePrices] = useState({});
  const flashTimersRef = useRef({});

  useEffect(() => {
    // Determine socket URL based on current host
    const socketUrl = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:5000";
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    newSocket.on("connect", () => {
      console.log("🟢 Connected to Socket.io server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.io server");
      setIsConnected(false);
    });

    newSocket.on("initial-prices", (prices) => {
      if (prices) {
        setLivePrices(prices);
      }
    });

    newSocket.on("price-tick", (tick) => {
      if (!tick || !tick.ticker) return;

      setLivePrices((prev) => {
        const symbol = tick.ticker;
        const prevItem = prev[symbol];
        let flash = null;

        if (prevItem && prevItem.price) {
          if (tick.price > prevItem.price) flash = "up";
          else if (tick.price < prevItem.price) flash = "down";
        }

        const updatedItem = {
          ...tick,
          flash,
        };

        // Reset flash state after 800ms
        if (flash) {
          if (flashTimersRef.current[symbol]) {
            clearTimeout(flashTimersRef.current[symbol]);
          }
          flashTimersRef.current[symbol] = setTimeout(() => {
            setLivePrices((latest) => {
              if (!latest[symbol]) return latest;
              return {
                ...latest,
                [symbol]: {
                  ...latest[symbol],
                  flash: null,
                },
              };
            });
          }, 800);
        }

        return {
          ...prev,
          [symbol]: updatedItem,
        };
      });
    });

    setSocket(newSocket);

    return () => {
      Object.values(flashTimersRef.current).forEach((t) => clearTimeout(t));
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, livePrices }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useStockTick = (ticker) => {
  const { livePrices } = useSocket();
  if (!ticker) return null;
  return livePrices[ticker.toUpperCase()] || null;
};
