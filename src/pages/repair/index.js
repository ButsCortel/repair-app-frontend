import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import { Row, Col, Spinner } from "react-bootstrap";
import RepairCard from "./components/RepairCard";
import api from "../../services/api";
import "./index.css";

const RepairPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [repairs, setRepairs] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
    // eslint-disable-next-line
  }, []);

  const getRepairs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/requests/all", {
        headers: { "auth-token": token },
      });
      setRepairs(response.data.repairs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };

  return !loading && repairs ? (
    <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
      {repairs.map((repair) => (
        <Col key={repair._id}>
          <RepairCard data={repair} handleClick={handleClick} />
        </Col>
      ))}
    </Row>
  ) : loading ? (
    <Row>
      <Col>
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col>
        <div className="text-center">No available data to show.</div>
      </Col>
    </Row>
  );
};

export default RepairPage;
