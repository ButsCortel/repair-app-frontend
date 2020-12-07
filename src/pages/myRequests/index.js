import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { MdAddToQueue } from "react-icons/md";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import "./index.css";

const MyRequestsPage = ({ history }) => {
  const { isLoggedIn, statusColor } = useContext(SessionContext);
  const [requests, setRequests] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
  }, []);

  const handleClick = (e, id) => {
    history.push("/repairs/" + id);
  };
  const handleCancel = (e, id) => {
    e.stopPropagation();
  };
  const handleDelete = (e, id) => {
    e.stopPropagation();
  };
  const getRepairs = async () => {
    try {
      const response = await api.get("/user/requests/", {
        headers: { "auth-token": token },
      });

      setRequests(response.data.repairs);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    requests && (
      <Row className="justify-content-between align-items-center">
        {/* <Button>
          Create Request <MdAddToQueue />
        </Button> */}
        <Col>
          <Table responsive bordered hover className="text-center table-sm">
            <thead>
              <tr>
                <th>Image</th>
                <th>Device</th>
                <th>Issue</th>
                <th>Type</th>
                <th>Status</th>
                <th>Update</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <RequestRow
                  handleClick={handleClick}
                  handleCancel={handleCancel}
                  handleDelete={handleDelete}
                  key={index}
                  data={request}
                  user={user}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    )
  );
};

export default MyRequestsPage;
