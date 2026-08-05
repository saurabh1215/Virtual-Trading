import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import styles from "./PageTemplate.module.css";

import clsx from "clsx";
import { Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../Template/Navbar";
import SecondNavbar from "../Template/SecondNavbar";
import Dashboard from "../Dashboard/Dashboard";
import News from "../News/News";
import Search from "../Search/Search";
import SettingsModal from "./SettingsModal";
import Axios from "axios";
import { SocketProvider } from "../../context/SocketContext";
import LiveTickerBar from "../Ticker/LiveTickerBar";

const drawerWidth = 260;


const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgba(15, 23, 42, 0.85) !important",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    background: "#1e293b !important",
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
}));

const PageTemplate = () => {
  const history = useHistory();
  const classes = useStyles();
  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [purchasedStocks, setPurchasedStocks] = useState([]);

  if (!userData.user) {
    history.push("/login");
  }

  useEffect(() => {
    const getPurchasedStocks = async () => {
      const url = `/api/stock/${userData.user.id}`;
      const headers = {
        "x-auth-token": userData.token,
      };
      const response = await Axios.get(url, { headers });
      if (response.data.status === "success") {
        setPurchasedStocks(response.data.stocks);
      }
    };
    getPurchasedStocks();
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  return (
    <SocketProvider>
      <div className={styles.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={styles.toolbar} style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(styles.menuButton, open && styles.menuButtonHidden)}
              >
                <MenuIcon />
              </IconButton>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 12px rgba(99, 102, 241, 0.5)"
                }}>
                  <ShowChartIcon style={{ color: "#ffffff" }} />
                </div>
                <Typography component="h1" variant="h6" noWrap style={{ fontFamily: "Outfit", fontWeight: 700, background: "linear-gradient(90deg, #f8fafc 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {currentPage === "dashboard" && "Dashboard Overview"}
                  {currentPage === "news" && "Market News & Insights"}
                  {currentPage === "search" && "Stock Search & Trade"}
                </Typography>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {userData.user && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(30, 41, 59, 0.8)", border: "1px solid rgba(99, 102, 241, 0.3)",
                  padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: 600, color: "#10b981"
                }}>
                  <AccountBalanceWalletIcon style={{ fontSize: "18px", color: "#10b981" }} />
                  <span>${userData.user.balance ? userData.user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : "0.00"}</span>
                </div>
              )}
              <Typography variant="body2" style={{ color: "#94a3b8", fontWeight: 500 }}>
                Welcome, <strong style={{ color: "#f8fafc" }}>{userData.user && userData.user.username ? userData.user.username.charAt(0).toUpperCase() + userData.user.username.slice(1) : ""}</strong>
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose) }} open={open}>
          <div className={styles.toolbarIcon} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
            <Typography variant="subtitle1" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#818cf8", letterSpacing: "0.5px" }}>
              VIRTUAL TRADER
            </Typography>
            <IconButton onClick={handleDrawerClose} style={{ color: "#94a3b8" }}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
          <List>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </List>
          <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", marginTop: "auto" }} />
          <List>
            <SecondNavbar logout={logout} openSettings={openSettings} />
          </List>
        </Drawer>

        <main className={styles.content}>
          <div className={classes.appBarSpacer} />
          <LiveTickerBar onSelectStock={(symbol) => setCurrentPage("search")} />
          {currentPage === "dashboard" && (
            <Dashboard purchasedStocks={purchasedStocks} />
          )}
          {currentPage === "news" && <News />}
          {currentPage === "search" && (
            <Search setPurchasedStocks={setPurchasedStocks} purchasedStocks={purchasedStocks} />
          )}
          {settingsOpen && <SettingsModal setSettingsOpen={setSettingsOpen} />}
        </main>
      </div>
    </SocketProvider>
  );

};

export default PageTemplate;

