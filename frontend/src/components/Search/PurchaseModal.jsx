import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Container, Typography, Box, Button, TextField, IconButton } from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./Search.module.css";
import { motion } from "framer-motion";
import Axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PurchaseModal = ({
  setSelected,
  stockInfo,
  pastDay,
  setPurchasedStocks,
  purchasedStocks,
}) => {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="backdrop"
    >
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }}>
        <PurchaseModalContent
          stockInfo={stockInfo}
          pastDay={pastDay}
          setSelected={setSelected}
          setPurchasedStocks={setPurchasedStocks}
          purchasedStocks={purchasedStocks}
        />
      </motion.div>
    </motion.div>
  );
};

const PurchaseModalContent = ({
  setSelected,
  stockInfo,
  pastDay,
  setPurchasedStocks,
  purchasedStocks,
}) => {
  const { userData, setUserData } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = Number(pastDay ? pastDay.adjClose : 0);
  const [total, setTotal] = useState(unitPrice);
  const queryClient = useQueryClient();

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val) && val >= 0) {
      const qty = Number(val);
      if (userData.user.balance - unitPrice * qty < 0) {
        return;
      }
      setQuantity(val);
      setTotal(Math.round((unitPrice * qty + Number.EPSILON) * 100) / 100);
    }
  };

  const purchaseMutation = useMutation(
    async (purchasePayload) => {
      const headers = {
        "x-auth-token": userData.token,
      };
      const url = "/api/stock";
      const response = await Axios.post(url, purchasePayload, { headers });
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (data.status === "success") {
          setUserData({
            token: userData.token,
            user: data.user,
          });
          queryClient.invalidateQueries(["purchasedStocks", userData.user.id]);
          setSelected(false);
        }
      },
    }
  );

  const handlePurchase = (e) => {
    e.preventDefault();
    purchaseMutation.mutate({
      userId: userData.user.id,
      ticker: stockInfo.ticker,
      quantity: Number(quantity),
      price: unitPrice,
    });
  };

  const remainingBalance = userData.user.balance - total;

  return (
    <div className={styles.modalPaper}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
          Buy {stockInfo.ticker} Shares
        </Typography>
        <IconButton onClick={() => setSelected(false)} style={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
          label="Stock Name"
          value={stockInfo.name}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
          label="Share Price"
          value={`$${unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Quantity of Shares"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
        />

        <Box p={2} my={2} style={{ background: "rgba(15, 23, 42, 0.6)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" style={{ color: "#94a3b8" }}>Total Order Price:</Typography>
            <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 800, color: "#34d399" }}>
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" style={{ color: "#94a3b8" }}>Est. Cash After Purchase:</Typography>
            <Typography variant="caption" style={{ fontWeight: 600, color: "#cbd5e1" }}>
              ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          className={styles.buyBtn}
          fullWidth
          onClick={handlePurchase}
          disabled={quantity <= 0}
        >
          Confirm Purchase
        </Button>
      </form>
    </div>
  );
};

export default PurchaseModal;

