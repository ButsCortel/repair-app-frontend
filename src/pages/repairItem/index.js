import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import { Row, Col } from "react-bootstrap";
const RequestItemPage = ({ history }) => {
  const { isLoggedIn, repair } = useContext(SessionContext);
  useEffect(() => {
    if (!isLoggedIn) history.push("/login");
    console.log(repair);
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
