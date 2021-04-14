import "./App.css";
import React from "react";
import Holdings from "./components/holdings";
import Transactions from "./components/transactions";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Transac from "./components/transactions";

function App() {

  return (
    <div className="app_container">
      <Router>
      <nav className="nav_container">
        <ul className="lists">
          <li className="list_item">
            <Link to="/">Home</Link>
          </li>
          <li className="list_item">
            <Link to="/holdings">Holdings</Link>
          </li>
          <li className="list_item">
            <Link  to="/transactions" >Transactions</Link>
          </li>
        </ul>
      </nav>
      <div className="body_conatiner">
        
          <Switch>
            <Route exact path="/transactions">
              <Transac />
            </Route>
            <Route exact path="/holdings">
              <Holdings />
            </Route>
            <Route exact path="/">
              Home
            </Route>
          </Switch>
        
      </div>
      </Router>
    </div>
  );
}

export default App;
