import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../user-context";
import { Row, Col, Table } from "react-bootstrap";
import api from "../../services/api";

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
    console.log(state.repairs);
  }, []);

  const getRepairs = async () => {
    try {
      const response = await api.get("/requests/all", {
        headers: { "auth-token": token },
      });
      setState({ ...state, repairs: response.data });
    } catch (error) {
      console.log(error);
    }
  };
  const mapRepairs = () => {
    // return (
    //   state.repairs.map((repair) => {
    //     return (
    //     )
    //   })
    // )
  };
  return (
    <>
      <Row className="text-center h-100 pt-5">
        <Col className="mt-5">
          <h1>Repairs</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No.</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Device</th>
                <th>Issue</th>
                <th>Tech</th>
                <th>Status</th>
              </tr>
            </thead>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default RepairPage;
