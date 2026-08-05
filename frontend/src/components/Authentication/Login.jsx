import React, { useState, useContext, useEffect } from "react";
import { Box, Typography, TextField, CssBaseline, Button, Card, CardContent, Grid, Link, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import styles from "./Auth.module.css";
import { jwtDecode } from "jwt-decode";
import ShowChartIcon from "@material-ui/icons/ShowChart";

const Login = () => {
  const history = useHistory();
  const { setUserData } = useContext(UserContext);
  const [load, setLoad] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const onSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoad(true);
    const newUser = { username, password };
    const url = "/api/auth/login";

    const loginRes = await Axios.post(url, newUser);

    if (loginRes.data.status === "fail") {
      setLoad(false);
      setUsernameError(loginRes.data.message);
      setPasswordError(loginRes.data.message);
    } else {
      setUserData(loginRes.data);
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    }
  };

  const handleDemoLogin = async () => {
    setLoad(true);
    const demoUser = { username: "trader_demo", password: "demopassword123" };
    // Try registering demo user first, if exists then log in
    await Axios.post("/api/auth/register", demoUser).catch(() => {});
    const loginRes = await Axios.post("/api/auth/login", demoUser);
    if (loginRes.data.token) {
      setUserData(loginRes.data);
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } else {
      setLoad(false);
    }
  };

  async function handleCallbackResponse(userData) {
    const userObject = jwtDecode(userData.credential);
    const { name, email } = userObject;
    const username = email;
    const password = name;

    const newUser = { username, password };
    const url = "/api/auth/google";

    const loginRes = await Axios.post(url, newUser);

    if (loginRes.data.status === "fail") {
      setLoad(false);
      setUsernameError(loginRes.data.message);
      setPasswordError(loginRes.data.message);
    } else {
      setUser(loginRes.data);
      setUserData(loginRes.data);
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    }
  }

  useEffect(() => {
    const loadButton = () => {
      setTimeout(() => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "demo_client_id",
            callback: handleCallbackResponse
          });
          const target = document.getElementById('signinDiv');
          if (target) {
            window.google.accounts.id.renderButton(target, {
              theme: "filled_blue",
              size: "large",
              shape: "pill"
            });
          }
        }
      }, 1000);
    };

    if (!user)
      loadButton();
    else
      history.push("/");
  }, [user]);

  return (
    <div className={styles.background}>
      <CssBaseline />
      <div className={styles.cardContainer}>
        <Card className={styles.paper}>
          <CardContent style={{ padding: 0 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)", marginBottom: "12px"
              }}>
                <ShowChartIcon style={{ color: "#ffffff", fontSize: "28px" }} />
              </div>
              <Typography variant="h5" className={styles.headerTitle}>
                Welcome Back
              </Typography>
              <Typography variant="body2" className={styles.headerSubtitle}>
                Sign in to your Virtual Trading Playground
              </Typography>
            </Box>

            <form className={styles.form} onSubmit={onSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                error={usernameError.length > 0}
                helperText={usernameError}
                value={username}
                onChange={onChangeUsername}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordError.length > 0}
                helperText={passwordError}
                value={password}
                onChange={onChangePassword}
              />

              <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
                {!load ? (
                  <>
                    <Button type="submit" variant="contained" className={styles.submit}>
                      Sign In
                    </Button>
                    <Button type="button" variant="outlined" className={styles.demoBtn} onClick={handleDemoLogin}>
                      ⚡ Instant Demo Login
                    </Button>
                  </>
                ) : (
                  <Box py={2}>
                    <CircularProgress style={{ color: "#6366f1" }} />
                  </Box>
                )}
              </Box>

              <Box display="flex" justifyContent="center" mt={2} mb={1}>
                <div id='signinDiv'></div>
              </Box>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" style={{ color: "#94a3b8" }}>
                Don't have an account?{" "}
                <Link href="/register" className={styles.linkText}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

