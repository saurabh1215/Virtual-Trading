import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { Typography, Box, Divider } from "@material-ui/core/";
import AccountBalanceWalletTwoToneIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import TrendingUpTwoToneIcon from "@material-ui/icons/TrendingUpTwoTone";
import TrendingDownTwoToneIcon from "@material-ui/icons/TrendingDownTwoTone";

const Balance = ({ purchasedStocks }) => {
  const { userData } = useContext(UserContext);
  const [portfolioBalance, setPortfolioBalance] = useState(0);

  useEffect(() => {
    let total = 0;
    if (purchasedStocks && Array.isArray(purchasedStocks)) {
      purchasedStocks.forEach((stock) => {
        total += Number(stock.currentPrice || stock.purchasePrice || 0) * Number(stock.quantity || 0);
      });
    }
    setPortfolioBalance(Math.round((total + Number.EPSILON) * 100) / 100);
  }, [purchasedStocks]);

  const cash = userData && userData.user ? userData.user.balance : 100000;
  const netTotal = cash + portfolioBalance;
  const profitOrLoss = netTotal - 100000;
  const returnPercentage = ((profitOrLoss / 100000) * 100).toFixed(2);
  const isPositive = netTotal >= 100000;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
            Account Balance
          </Typography>
          <div style={{
            padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 700,
            background: isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            color: isPositive ? "#34d399" : "#f87171", border: isPositive ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            {isPositive ? <TrendingUpTwoToneIcon style={{ fontSize: "16px" }} /> : <TrendingDownTwoToneIcon style={{ fontSize: "16px" }} />}
            {isPositive ? `+${returnPercentage}%` : `${returnPercentage}%`}
          </div>
        </Box>

        <Box my={2} p={2} style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <Typography variant="caption" style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Net Portfolio Value
          </Typography>
          <Typography variant="h4" style={{ fontFamily: "Outfit", fontWeight: 800, color: isPositive ? "#34d399" : "#f87171", marginTop: "4px" }}>
            ${netTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap="12px" my={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" p={1.5} style={{ background: "rgba(30, 41, 59, 0.5)", borderRadius: "10px" }}>
            <Box display="flex" alignItems="center" gap="8px">
              <AccountBalanceWalletTwoToneIcon style={{ color: "#818cf8", fontSize: "20px" }} />
              <Typography variant="body2" style={{ color: "#cbd5e1" }}>Available Cash</Typography>
            </Box>
            <Typography variant="body1" style={{ fontWeight: 600, color: "#f8fafc" }}>
              ${cash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" p={1.5} style={{ background: "rgba(30, 41, 59, 0.5)", borderRadius: "10px" }}>
            <Box display="flex" alignItems="center" gap="8px">
              <TrendingUpTwoToneIcon style={{ color: "#34d399", fontSize: "20px" }} />
              <Typography variant="body2" style={{ color: "#cbd5e1" }}>Stock Holdings</Typography>
            </Box>
            <Typography variant="body1" style={{ fontWeight: 600, color: "#f8fafc" }}>
              ${portfolioBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      </div>

      <div>
        <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", marginBottom: "12px" }} />
        <Typography variant="caption" style={{ color: "#64748b", display: "block", textAlign: "center" }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Typography>
      </div>
    </div>
  );
};

export default Balance;

