import React, { useState, useEffect } from "react";
// BrowserRouter as Router means that we are using the BrowserRouter component as Router.
// For example:  Switch as Rajat means that we use Switch as Rajat.
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [userData, setUserData] = useState({ token: undefined, user: undefined });

  const { data: authData } = useQuery(
    ["authUser"],
    async () => {
      let token = localStorage.getItem("auth-token");
      if (!token) {
        localStorage.setItem("auth-token", "");
        return { token: undefined, user: undefined };
      }
      const headers = { "x-auth-token": token };
      const tokenIsValid = await Axios.post("/api/auth/validate", null, { headers });
      if (tokenIsValid.data) {
        const userRes = await Axios.get("/api/auth/user", { headers });
        return { token, user: userRes.data };
      }
      return { token: undefined, user: undefined };
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  useEffect(() => {
    if (authData) {
      setUserData(authData);
    }
  }, [authData]);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>

        <div>
          <Switch>
            { userData.user ?
              (<Route path="/" exact component={PageTemplate}/>) 
              : 
              (<Route path="/" exact component={Login} />)
            }
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route component={NotFound} />
          </Switch>
        </div>

      </UserContext.Provider>
    </Router>
  );
}

export default App;
