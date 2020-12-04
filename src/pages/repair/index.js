import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../user-context";
import { Row, Col, CardDeck } from "react-bootstrap";
import RepairCard from "./components/RepairCard";
import api from "../../services/api";
import "./index.css";

const RepairPage = ({ history }) => {
  const { isLoggedIn } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [state, setState] = useState({
    repairs: [],
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
      setState({ ...state, repairs: response.data.repairs });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
        {state.repairs.map((repair) => (
          <Col>
            <RepairCard data={repair} key={repair.id} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RepairPage;
