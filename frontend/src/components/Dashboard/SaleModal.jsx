import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import styles from "../Search/Search.module.css";
import { Typography, IconButton, Box, Button, TextField } from "@material-ui/core";
import { motion } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";

const SaleModal = ({ setStart, stock }) => {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="backdrop"
    >
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }}>
        <SaleModalContent setStart={setStart} stock={stock} />
      </motion.div>
    </motion.div>
  );
};

const SaleModalContent = ({ setStart, stock }) => {
  const { userData } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);
  const price = Number(stock.currentPrice || stock.purchasePrice || 0);

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val) && Number(val) <= stock.quantity && Number(val) >= 1) {
      setQuantity(val);
    }
  };

  const sellStock = async (e) => {
    e.preventDefault();

    const headers = {
      "x-auth-token": userData.token,
    };
    const data = {
      stockId: stock.id,
      quantity: Number(quantity),
      userId: userData.user.id,
      price: price,
    };

    const url = `/api/stock`;
    const response = await Axios.patch(url, data, { headers });

    if (response.data.status === "success") {
      setStart(false);
      window.location.reload();
    }
  };

  const totalRevenue = price * Number(quantity);

  return (
    <div className={styles.modalPaper}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
          Sell Shares of {stock.ticker}
        </Typography>
        <IconButton onClick={() => setStart(false)} style={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField variant="outlined" margin="normal" fullWidth disabled label="Stock Name" value={stock.name || stock.ticker} />
        <TextField variant="outlined" margin="normal" fullWidth disabled label="Current Share Price" value={`$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
        <TextField variant="outlined" margin="normal" required fullWidth label={`Shares to Sell (Max ${stock.quantity})`} type="number" value={quantity} onChange={handleQuantityChange} />

        <Box p={2} my={2} style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" style={{ color: "#94a3b8" }}>Total Sale Revenue:</Typography>
            <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 800, color: "#34d399" }}>
              +${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#ffffff",
            fontWeight: 700, borderRadius: "14px", padding: "12px", width: "100%", textTransform: "none", fontSize: "16px"
          }}
          onClick={sellStock}
        >
          Confirm Sale
        </Button>
      </form>
    </div>
  );
};

export default SaleModal;

