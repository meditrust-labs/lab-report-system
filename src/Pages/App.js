import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import { AuthProvider } from "../contexts/AuthContext";

import Login from "./Login";
import Dashboard from "./Dashboard";
import ResetPassword from "./ResetPassword";

import { 
  TEST_REPORT_URL, 
  FINAL_REPORT_URL, 
  STAMP_URL, 
  CACHE_NAME 
} from "../Utils/config";

function App() {
  const [loading, setLoading] = useState(true);

  const cacheData = async () => {
    setLoading(true);
    try {
      const cacheStorage = await caches.open(CACHE_NAME);
      const keys = await cacheStorage.keys();
      if (keys.length < 3) {
        await cacheStorage.addAll([
          TEST_REPORT_URL,
          FINAL_REPORT_URL,
          STAMP_URL
        ]);
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
          <img src="/assets/images/loader.gif" alt="loader" />
        </Container>
      )}
      {!loading && (
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
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
