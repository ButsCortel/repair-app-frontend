import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const ErrorPage = () => {
  return (
    <>
      <Row className="text-center align-items-center h-100">
        <Col>
          <h1>Error 404</h1>
          <p>Page not found!</p>
        </Col>
      </Row>
    </>
  );
};

export default ErrorPage;
