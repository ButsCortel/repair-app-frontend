import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import { Row, Col } from "react-bootstrap";
import "./index.css";
const RequestItemPage = ({ history }) => {
  const { isLoggedIn, repair } = useContext(SessionContext);
  useEffect(() => {
    if (!isLoggedIn) history.push("/login");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Row className="text-center justify-content-around align-items-start">
        <Col md={12} lg={6}>
          <div className="mw-100 product-img">
            <img className="mh-100 mw-100" src={repair.image_url} />
          </div>
        </Col>
        <Col md={12} lg={6}>
          <h4>Request Details:</h4>
          <dl className="details-body text-left">
            <dt>Request ID</dt>
            <dd>{repair._id}</dd>
            <dt>Requestor</dt>
            <dd title={repair.customer.email}>
              {repair.customer.firstName} {repair.customer.lastName}
            </dd>
            <dt>Device</dt>
            <dd>{repair.device}</dd>
            <dt>Issue/Description</dt>
            <dd>{repair.issue}</dd>
          </dl>
        </Col>
      </Row>
    </>
  );
};

export default RequestItemPage;
