import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../user-context";
import { Row, Col } from "react-bootstrap";
const RequestItemPage = ({ history, params }) => {
  const { isLoggedIn } = useContext(UserContext);
  useEffect(() => {
    if (!isLoggedIn) history.push("/login");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Row className="text-center align-items-center h-100">
        <Col>
          <h1>RequestItems</h1>
        </Col>
      </Row>
    </>
  );
};

export default RequestItemPage;
