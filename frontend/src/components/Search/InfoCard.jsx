import React, { useState } from "react";
import { Box, Typography, Button } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useStockTick } from "../../context/SocketContext";

const InfoCard = ({ stockInfo, pastDay, pastDataPeriod }) => {
  const [following, setFollowing] = useState(false);
  const liveTick = useStockTick(stockInfo ? stockInfo.ticker : null);

  const basePrice = pastDay ? pastDay.adjClose : 0;
  const price = liveTick && liveTick.price ? liveTick.price : basePrice;

  const prevPrice = pastDataPeriod && pastDataPeriod.length > 1
    ? pastDataPeriod[0].adjClose
    : pastDay ? pastDay.adjOpen : price;

  const diff = price - prevPrice;
  const diffPercent = prevPrice > 0 ? (diff / prevPrice) * 100 : (liveTick ? liveTick.changePercent : 0);
  const isPositive = diff >= 0;

  const flashClass = liveTick && liveTick.flash === "up" ? "flash-green" : liveTick && liveTick.flash === "down" ? "flash-red" : "";

  const todayDateStr = pastDay && pastDay.date
    ? new Date(pastDay.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : "Live Market Data";

  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Exchange & Ticker Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="caption" style={{ color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px" }}>
          {stockInfo.exchangeCode || "NASDAQ"}: {stockInfo.ticker}
        </Typography>
        
        <Button
          variant={following ? "outlined" : "contained"}
          onClick={() => setFollowing(!following)}
          style={{
            borderRadius: "20px",
            padding: "4px 16px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "13px",
            background: following ? "rgba(99, 102, 241, 0.15)" : "#818cf8",
            color: following ? "#818cf8" : "#0f172a",
            borderColor: "#818cf8",
          }}
          startIcon={following ? <CheckIcon /> : <AddIcon />}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </Box>

      {/* Main Stock Title */}
      <Typography variant="h4" style={{ fontFamily: "Outfit", fontWeight: 800, color: "#f8fafc", marginBottom: "8px" }}>
        {stockInfo.name}
      </Typography>

      {/* Big Price & Percentage Pill */}
      <Box display="flex" flexWrap="wrap" alignItems="baseline" gap="14px">
        <div
          className={flashClass}
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "16px",
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <Typography variant="h2" style={{ fontFamily: "Outfit", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px" }}>
            {price ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : "--"}
          </Typography>
          <Typography variant="h6" style={{ color: "#94a3b8", fontWeight: 600 }}>
            USD
          </Typography>
        </div>

        {/* Change Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "6px 14px",
          borderRadius: "10px",
          background: isPositive ? "rgba(16, 185, 129, 0.18)" : "rgba(239, 68, 68, 0.18)",
          color: isPositive ? "#34d399" : "#f87171",
          fontWeight: 700,
          fontSize: "15px"
        }}>
          {isPositive ? <ArrowUpwardIcon style={{ fontSize: "16px" }} /> : <ArrowDownwardIcon style={{ fontSize: "16px" }} />}
          {Math.abs(diffPercent).toFixed(2)}%
        </div>

        <Typography variant="body2" style={{ color: isPositive ? "#34d399" : "#f87171", fontWeight: 600 }}>
          {isPositive ? "+" : ""}{diff.toFixed(2)} today
        </Typography>
      </Box>

      {/* Timestamp */}
      <Typography variant="caption" style={{ color: "#64748b", display: "block", marginTop: "8px" }}>
        {todayDateStr} • Live WebSocket Streaming {liveTick ? "🟢 Active" : "⚪ Standby"}
      </Typography>
    </div>
  );
};

export default InfoCard;

