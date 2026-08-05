import React from "react";
import { Grid, Typography, Box, Button } from "@material-ui/core/";
import styles from "./Search.module.css";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const PurchaseCard = ({ setSelected, balance }) => {
  return (
    <Grid item xs={12} md={4}>

      <div className={styles.glassCard} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div>
          <Box display="flex" alignItems="center" gap="10px" mb={2}>
            <ShoppingCartIcon style={{ color: "#34d399", fontSize: "24px" }} />
            <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
              Trade Order System
            </Typography>
          </Box>

          <Typography variant="caption" style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Available Buying Power
          </Typography>
          <Typography variant="h4" style={{ fontFamily: "Outfit", fontWeight: 800, color: "#10b981", margin: "4px 0 16px" }}>
            ${balance ? balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : "0.00"}
          </Typography>

          <Typography variant="body2" style={{ color: "#cbd5e1", lineHeight: 1.5 }}>
            Ready to execute a trade? Click below to select your desired quantity and buy shares instant using your virtual balance.
          </Typography>
        </div>

        <Box mt={3}>
          <Button
            type="button"
            variant="contained"
            className={styles.buyBtn}
            fullWidth
            onClick={() => setSelected(true)}
          >
            ⚡ Buy Shares Now
          </Button>
        </Box>
      </div>
    </Grid>
  );
};

export default PurchaseCard;

