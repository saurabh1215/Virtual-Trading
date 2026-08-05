import React from "react";
import { useSocket } from "../../context/UserContext" // wait, from ../../context/SocketContext
import { useSocket as useSocketContext } from "../../context/SocketContext";
import { Box, Typography } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const defaultTickers = ["AAPL", "AMZN", "GOOG", "MSFT", "TSLA", "NVDA", "WMT", "INTC", "GS", "JNJ"];


const LiveTickerBar = ({ onSelectStock }) => {
  const { isConnected, livePrices } = useSocketContext();

  return (
    <Box
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        position: "sticky",
        top: "64px",
        zIndex: 1100,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Connection Indicator Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: isConnected ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
          border: `1px solid ${isConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          color: isConnected ? "#34d399" : "#fbbf24",
          fontSize: "12px",
          fontWeight: 700,
          fontFamily: "Outfit",
          flexShrink: 0,
        }}
      >
        <FiberManualRecordIcon
          style={{
            fontSize: "10px",
            color: isConnected ? "#10b981" : "#f59e0b",
            animation: isConnected ? "pulseGlow 1.5s infinite" : "none",
          }}
        />
        <span>{isConnected ? "LIVE STREAM" : "CONNECTING..."}</span>
      </div>

      {/* Ticker Cards */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1 }}>
        {defaultTickers.map((symbol) => {
          const item = livePrices[symbol] || {
            ticker: symbol,
            price: symbol === "BTC" ? 64500 : symbol === "ETH" ? 3450 : 150,
            changePercent: 0,
            flash: null,
          };

          const isPositive = item.changePercent >= 0;
          const isUp = item.flash === "up";
          const isDown = item.flash === "down";

          let flashClass = "";
          if (isUp) flashClass = "flash-green";
          if (isDown) flashClass = "flash-red";

          return (
            <div
              key={symbol}
              className={`ticker-card ${flashClass}`}
              onClick={() => onSelectStock && onSelectStock(symbol)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "12px",
                background: isUp
                  ? "rgba(16, 185, 129, 0.25)"
                  : isDown
                  ? "rgba(239, 68, 68, 0.25)"
                  : "rgba(30, 41, 59, 0.7)",
                border: isUp
                  ? "1px solid rgba(16, 185, 129, 0.6)"
                  : isDown
                  ? "1px solid rgba(239, 68, 68, 0.6)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 700, fontFamily: "Outfit", color: "#f8fafc", fontSize: "13px" }}>
                {symbol}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontFamily: "Outfit",
                  color: isUp ? "#34d399" : isDown ? "#f87171" : "#e2e8f0",
                  fontSize: "13px",
                  transition: "color 0.2s ease",
                }}
              >
                ${item.price ? item.price.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "--"}
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: isPositive ? "#34d399" : "#f87171",
                }}
              >
                {isPositive ? <ArrowUpwardIcon style={{ fontSize: "12px" }} /> : <ArrowDownwardIcon style={{ fontSize: "12px" }} />}
                {Math.abs(item.changePercent || 0).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default LiveTickerBar;
