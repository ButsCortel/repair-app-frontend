import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import { Row, Col, CardDeck } from "react-bootstrap";
import RepairCard from "./components/RepairCard";
import api from "../../services/api";
import "./index.css";

const RepairPage = ({ history }) => {
  const { isLoggedIn, repairs, setRepairs } = useContext(SessionContext);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [state, setState] = useState({
    hasError: false,
    errorMessage: "",
    success: false,
  });

  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
    // eslint-disable-next-line
  }, []);

  const getRepairs = async () => {
    try {
      const response = await api.get("/requests/all", {
        headers: { "auth-token": token },
      });
      setRepairs(response.data.repairs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
        {repairs.map((repair) => (
          <Col key={repair.id}>
            <RepairCard data={repair} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RepairPage;
