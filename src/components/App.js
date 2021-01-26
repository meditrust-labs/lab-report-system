import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import { Dashboard, Signup, Login, ResetPassword, PrivateRoute } from "./index";
import { db } from "../firebase";

function App() {
  async function updateRefrence() {
    try {
      const docRef = db.collection("current").doc("qQPUfK0bBrOKPydyBtH3");
      const doc = await docRef.get();
      if (doc.exists) {
        const prevDate = doc.data().date.toDate().toString().split(" ")[2];
        const dateObj = new Date();
        const date = dateObj.getUTCDate().toString();

        if (prevDate !== date) {
          console.log("updating value");
          await docRef.update({ date: date, refrence: 0 });
        }
        console.log(date);
        console.log(prevDate);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function checkDate() {
      try {
        const storage = window.localStorage;
        const d = storage.getItem("date");
        console.log("d =>", d);
        const dateObj = new Date();
        const date = dateObj.getUTCDate().toString();
        console.log("date =>", date);

        if (d !== date) {
          await updateRefrence();
          console.log("updating refrence no");
          storage.setItem("date", date);
        }
      } catch (err) {
        console.log(err);
      }
    }

    checkDate();
  }, []);

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/reset-password" component={ResetPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
