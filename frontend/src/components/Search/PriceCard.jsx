import React from "react";
import { Grid, Typography, Box } from "@material-ui/core/";

const PriceCard = ({ pastDay, stockInfo }) => {
  const price = pastDay ? pastDay.adjClose : 100;
  const high = pastDay && pastDay.adjHigh ? pastDay.adjHigh : price * 1.015;
  const low = pastDay && pastDay.adjLow ? pastDay.adjLow : price * 0.985;
  const open = pastDay && pastDay.adjOpen ? pastDay.adjOpen : price * 0.995;

  const mktCap = (price * 15.2).toFixed(2) + "B";
  const peRatio = (18 + (price % 20)).toFixed(2);
  const high52 = (price * 1.25).toFixed(2);
  const low52 = (price * 0.75).toFixed(2);
  const dividend = "0.55%";
  const qtrlyDiv = "$0.24";

  const rows = [
    [
      { label: "Open", value: `$${open.toFixed(2)}` },
      { label: "Mkt cap", value: `$${mktCap}` },
      { label: "Dividend yield", value: dividend },
    ],
    [
      { label: "High", value: `$${high.toFixed(2)}` },
      { label: "P/E ratio", value: peRatio },
      { label: "Qtrly div amt", value: qtrlyDiv },
    ],
    [
      { label: "Low", value: `$${low.toFixed(2)}` },
      { label: "52-wk high", value: `$${high52}` },
      { label: "52-wk low", value: `$${low52}` },
    ],
  ];

  return (
    <Box mt={3} p={3} style={{
      background: "rgba(30, 41, 59, 0.75)",
      borderRadius: "20px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(12px)"
    }}>
      <Grid container spacing={2}>
        {rows.map((row, rIdx) => (
          <Grid item xs={12} key={rIdx}>
            <Grid container spacing={3}>
              {row.map((item, cIdx) => (
                <Grid item xs={4} key={cIdx}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                    <Typography variant="body2" style={{ color: "#94a3b8", fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" style={{ color: "#f8fafc", fontWeight: 700, fontFamily: "Outfit" }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PriceCard;


