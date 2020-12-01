import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
//Pages
import RepairsPage from "./pages/repair";
import RequestPage from "./pages/request";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import RepairItemPage from "./pages/repairItem";
import ErrorPage from "./pages/404";
import TopNav from "./components/TopNav.js";

import { ContextWrapper } from "./user-context";

const Routes = () => {
  return (
    <ContextWrapper>
      <BrowserRouter>
        <TopNav />
        <Container>
          <Switch>
            <Route path="/login" exact component={LoginPage} />
            <Route path="/register" exact component={RegisterPage} />
            <Route path="/" exact component={RepairsPage} />
            <Route path="/repairs/:id" exact component={RepairItemPage} />
            <Route path="/repairs/create" exact component={RequestPage} />
            <Route path="/404" exact component={ErrorPage} />
            <Redirect to="/404" />
          </Switch>
        </Container>
      </BrowserRouter>
    </ContextWrapper>
  );
};
export default Routes;
