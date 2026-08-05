import React, { useState } from "react";
import { CircularProgress, Box, Typography, TextField, CssBaseline, Button, Card, CardContent, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import styles from "./Auth.module.css";
import ShowChartIcon from "@material-ui/icons/ShowChart";

const Register = () => {
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length < 4 || newUsername.length > 15) {
      setUsernameError("Username must be between 4 and 15 characters.");
    } else {
      setUsernameError("");
    }
  };
  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6 || newPassword.length > 20) {
      setPasswordError("Password must be between 6 and 20 characters.");
    } else {
      setPasswordError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (!usernameError && !passwordError) {

      const newUser = { username, password };
      const url = "/api/auth/register";
      const registerRes = await Axios.post(url, newUser);
      
      if (registerRes.length !== '7' && registerRes.data.status === "fail") {
        setLoad(false);
        if (!registerRes.data.type) {
          setPasswordError(registerRes.data.message);
          setUsernameError(registerRes.data.message);
        } else if (registerRes.data.type === "username") {
          setUsernameError(registerRes.data.message);
        } else if (registerRes.data.type === "password") {
          setPasswordError(registerRes.data.message);
        }
      } else {
        history.push("/login");
      }
    }
    setLoad(false);
  };

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
                Create Account
              </Typography>
              <Typography variant="body2" className={styles.headerSubtitle}>
                Get $100,000 in virtual cash to start trading
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
              <Box display="flex" justifyContent="center" mt={1}>
                {!load ? (
                  <Button type="submit" variant="contained" className={styles.submit}>
                    Create Account
                  </Button>
                ) : (
                  <Box py={2}>
                    <CircularProgress style={{ color: "#6366f1" }} />
                  </Box>
                )}
              </Box>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" style={{ color: "#94a3b8" }}>
                Already have an account?{" "}
                <Link href="/login" className={styles.linkText}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

