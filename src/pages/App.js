import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from "@Contexts/AuthContext";
import { PrivateRoute } from "@Components";

import Signup from '@Pages/Signup'
import Login from "@Pages/Login";
import Dashboard from "@Pages/Dashboard";
import ResetPassword from "@Pages/ResetPassword";

import { 
  TEST_REPORT_URL, 
  FINAL_REPORT_URL, 
  STAMP_URL, 
  CACHE_NAME 
} from "../constants";

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
      <Toaster />
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
              <Route path="/signup" component={Signup} />
            </Switch>
          </AuthProvider>
        </Router>
      )}
    </div>
  );
}

export default App;
