import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
//Pages
import RepairPage from "./pages/repair";
import RequestPage from "./pages/request";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import TopNav from "./components/TopNav.js";
import { ContextWrapper } from "./user-context";

const Routes = () => {
  return (
    <ContextWrapper>
      <BrowserRouter>
        <TopNav />
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
          <Route path="/" exact component={RepairPage} />
          <Route path="/request" exact component={RequestPage} />
        </Switch>
      </BrowserRouter>
    </ContextWrapper>
  );
};
export default Routes;
