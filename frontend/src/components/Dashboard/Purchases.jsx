import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Box } from "@material-ui/core";
import SaleModal from "./SaleModal";
import ShoppingCartTwoToneIcon from "@material-ui/icons/ShoppingCartTwoTone";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";

const Purchases = ({ purchasedStocks }) => {
  const [start, setStart] = useState(false);
  const [stock, setStock] = useState(undefined);

  const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const openSaleModal = (stock) => {
    setStock(stock);
    setStart(true);
  };

  return (
    <React.Fragment>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
          Active Portfolio Holdings
        </Typography>

        <Typography variant="caption" style={{ color: "#94a3b8" }}>
          {purchasedStocks ? purchasedStocks.length : 0} Assets Owned
        </Typography>
      </Box>

      {(!purchasedStocks || purchasedStocks.length === 0) ? (
        <Box textAlign="center" py={6} style={{ background: "rgba(15, 23, 42, 0.4)", borderRadius: "16px", border: "1px stroke rgba(255, 255, 255, 0.05)" }}>
          <ShoppingCartTwoToneIcon style={{ fontSize: "48px", color: "#6366f1", marginBottom: "12px", opacity: 0.8 }} />
          <Typography variant="h6" style={{ fontFamily: "Outfit", color: "#e2e8f0" }}>
            No Stock Holdings Yet
          </Typography>
          <Typography variant="body2" style={{ color: "#94a3b8", maxWidth: "360px", margin: "8px auto 0" }}>
            Search for stocks like Apple (AAPL), Tesla, or Amazon in the Stock Search tab to place your first trade!
          </Typography>
        </Box>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "#94a3b8", fontWeight: 600 }}>Ticker</TableCell>
                <TableCell style={{ color: "#94a3b8", fontWeight: 600 }}>Company Name</TableCell>
                <TableCell style={{ color: "#94a3b8", fontWeight: 600 }}>Shares</TableCell>
                <TableCell align="right" style={{ color: "#94a3b8", fontWeight: 600 }}>Avg Buy Price</TableCell>
                <TableCell align="right" style={{ color: "#94a3b8", fontWeight: 600 }}>Total Invested</TableCell>
                <TableCell align="right" style={{ color: "#94a3b8", fontWeight: 600 }}>Current Price</TableCell>
                <TableCell align="right" style={{ color: "#94a3b8", fontWeight: 600 }}>Current Value</TableCell>
                <TableCell align="right" style={{ color: "#94a3b8", fontWeight: 600 }}>Return</TableCell>
                <TableCell align="center" style={{ color: "#94a3b8", fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchasedStocks.map((row) => {
                const currentP = Number(row.currentPrice || row.purchasePrice);
                const purchaseP = Number(row.purchasePrice);
                const difference = (currentP - purchaseP) / purchaseP;
                const purchaseTotal = Number(row.quantity) * purchaseP;
                const currentTotal = Number(row.quantity) * currentP;
                const isGain = difference >= 0;

                return (
                  <TableRow key={row.id} style={{ transition: "background 0.2s ease" }}>
                    <TableCell>
                      <div style={{
                        display: "inline-block", padding: "4px 10px", borderRadius: "8px",
                        background: "rgba(99, 102, 241, 0.2)", color: "#818cf8",
                        fontWeight: 700, fontFamily: "Outfit", border: "1px solid rgba(99, 102, 241, 0.3)"
                      }}>
                        {row.ticker}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: 500, color: "#f8fafc" }}>
                      {row.name || row.ticker}
                    </TableCell>
                    <TableCell style={{ fontWeight: 600, color: "#e2e8f0" }}>
                      {row.quantity}
                    </TableCell>
                    <TableCell align="right" style={{ color: "#cbd5e1" }}>
                      ${purchaseP.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" style={{ color: "#cbd5e1" }}>
                      ${roundNumber(purchaseTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 600, color: isGain ? "#34d399" : "#f87171" }}>
                      ${currentP.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: 700, color: "#f8fafc" }}>
                      ${roundNumber(currentTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right">
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: "2px",
                        padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                        background: isGain ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: isGain ? "#34d399" : "#f87171",
                      }}>
                        {isGain ? <TrendingUpIcon style={{ fontSize: "14px" }} /> : <TrendingDownIcon style={{ fontSize: "14px" }} />}
                        {Math.abs(difference * 100).toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openSaleModal(row)}
                        style={{
                          borderColor: "rgba(239, 68, 68, 0.5)", color: "#f87171",
                          borderRadius: "8px", textTransform: "none", fontWeight: 600
                        }}
                      >
                        Sell Shares
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {start && stock && <SaleModal setStart={setStart} stock={stock} />}
    </React.Fragment>
  );
};

export default Purchases;

