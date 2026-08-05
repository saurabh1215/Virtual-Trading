import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import styles from "../Search/Search.module.css";
import { Typography, IconButton, Box, Button, TextField } from "@material-ui/core";
import { motion } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";

const SettingsModal = ({ setSettingsOpen }) => {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="backdrop"
    >
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }}>
        <SettingsModalContent setSettingsOpen={setSettingsOpen} />
      </motion.div>
    </motion.div>
  );
};

const SettingsModalContent = ({ setSettingsOpen }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [activateSafetyButton, setActiveSafetyButton] = useState(false);

  const resetAccount = async (e) => {
    e.preventDefault();
    const headers = {
      "x-auth-token": userData.token,
    };

    const url = `/api/stock/${userData.user.id}`;
    const response = await Axios.delete(url, { headers });

    if (response.data.status === "success") {
      setUserData({
        token: userData.token,
        user: response.data.user,
      });
      setSettingsOpen(false);
      window.location.reload();
    }
  };

  return (
    <div className={styles.modalPaper}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc" }}>
          Account Settings
        </Typography>
        <IconButton onClick={() => setSettingsOpen(false)} style={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
          label="Username"
          value={userData.user.username}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          disabled
          label="Available Cash Balance"
          value={`$${userData.user.balance ? userData.user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : "0.00"}`}
        />

        <Box my={3} p={2} style={{ background: "rgba(239, 68, 68, 0.1)", borderRadius: "14px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <Typography variant="subtitle2" style={{ color: "#f87171", fontWeight: 700, marginBottom: "4px" }}>
            Reset Portfolio Account
          </Typography>
          <Typography variant="caption" style={{ color: "#cbd5e1", display: "block", marginBottom: "12px" }}>
            Resetting your account will sell all portfolio holdings and restore your cash balance back to $100,000.
          </Typography>

          {!activateSafetyButton ? (
            <Button
              variant="outlined"
              fullWidth
              style={{ borderColor: "#ef4444", color: "#f87171", textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
              onClick={() => setActiveSafetyButton(true)}
            >
              Reset Account to $100,000
            </Button>
          ) : (
            <Box display="flex" gap="10px">
              <Button
                variant="contained"
                style={{ background: "#ef4444", color: "#ffffff", fontWeight: 700, textTransform: "none", borderRadius: "10px", flex: 1 }}
                onClick={resetAccount}
              >
                Confirm Reset
              </Button>
              <Button
                variant="outlined"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#94a3b8", textTransform: "none", borderRadius: "10px", flex: 1 }}
                onClick={() => setActiveSafetyButton(false)}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </div>
  );
};

export default SettingsModal;

