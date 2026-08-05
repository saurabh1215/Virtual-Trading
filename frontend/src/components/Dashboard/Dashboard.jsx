import React from "react";
import styles from "../Template/PageTemplate.module.css";
import { Container, Grid, Paper } from "@material-ui/core";
import Chart from "./Chart";
import Balance from "./Balance";
import Purchases from "./Purchases";

const Dashboard = ({ purchasedStocks }) => {
  const cardStyle = {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    background: "rgba(30, 41, 59, 0.75)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
    height: "100%",
  };

  return (
    <Container maxWidth="lg" className={styles.container} style={{ paddingTop: "24px", paddingBottom: "40px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={8}>
          <Paper style={{ ...cardStyle, minHeight: "380px" }}>
            <Chart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <Paper style={{ ...cardStyle, minHeight: "380px" }}>
            <Balance purchasedStocks={purchasedStocks} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={cardStyle}>
            <Purchases purchasedStocks={purchasedStocks} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

