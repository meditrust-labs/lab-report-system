import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import { AuthProvider } from "../contexts/AuthContext";
import { Dashboard, Login, ResetPassword, PrivateRoute, Signup } from "./index";
import { BASE_URL, CACHE_NAME } from "../config";

function App() {
  const [loading, setLoading] = useState(true);

  const cacheData = async () => {
    setLoading(true);
    try {
      const cacheStorage = await caches.open(CACHE_NAME);
      const keys = await cacheStorage.keys();

      if (keys.length < 3) {
        await cacheStorage.addAll([
          BASE_URL + "/report.pdf",
          BASE_URL + "/edit-report.pdf",
          BASE_URL + "/stamp.png",
        ]);

        // console.log(await cacheStorage.keys());
      } else {
        // console.log(keys);
      }
    } catch (err) {
      console.log("Caching Error => ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cacheData();
  }, []);

  return (
    <div className="App">
      {loading && (
        <Container className="pt-4 text-center">
          <img src="/830.gif" alt="loader" />
        </Container>
      )}
      {!loading && (
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              {/* <Route path="/signup" component={Signup} /> */}
            </Switch>
          </AuthProvider>
        </Router>
      )}
    </div>
  );
}

export default App;
