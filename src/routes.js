import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
//Pages
import RepairsPage from "./pages/repair";
import RequestPage from "./pages/request";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import RepairItemPage from "./pages/repairItem";
import MyRequestsPage from "./pages/myRequests/";
import TopNav from "./components/TopNav.js";

import { ContextWrapper } from "./session-context";

const Routes = () => {
  return (
    <ContextWrapper>
      <BrowserRouter>
        <Container fluid>
          <Row className="h-100 flex-column flex-nowrap">
            <TopNav />
            <Col className="px-0 flex-grow-1">
              <Container className="h-100">
                <Switch>
                  <Route path="/login" exact component={LoginPage} />
                  <Route path="/register" exact component={RegisterPage} />
                  <Route path="/" exact component={RepairsPage} />
                  <Route
                    path="/repairs/create"
                    exact
                    component={MyRequestsPage}
                  />
                  <Route path="/repairs/:id" exact component={RepairItemPage} />
                  <Redirect to="/" />
                </Switch>
              </Container>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </ContextWrapper>
  );
};
export default Routes;
