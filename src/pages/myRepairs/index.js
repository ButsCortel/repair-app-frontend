import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { MdAddToQueue } from "react-icons/md";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import "./index.css";

const MyRepairsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [requests, setRequests] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn || user.type === "USER") return history.push("/login");
    if (user.type === "USER") return history.push("/");
    getRepairs();
  }, []);

  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  const handleSort = (event) => {
    const property = event.target.textContent.toLowerCase();
    const compare = (a, b) => {
      if (property === "type") {
        return b.expedite - a.expedite;
      }
      if (property === "update") {
        return new Date(b.lastUpdate) - new Date(a.lastUpdate);
      }
      if (a[property].toLowerCase() < b[property].toLowerCase()) return -1;
      if (a[property].toLowerCase() > b[property].toLowerCase()) return 1;
      return 0;
    };
    const sorted = requests.sort(compare);
    setRequests([...sorted]);
  };
  const getRepairs = async () => {
    try {
      const response = await api.get("/tech/requests/", {
        headers: { "auth-token": token },
      });

      setRequests(response.data.repairs);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Row className="justify-content-between align-items-center">
      <Col>
        <Table
          striped
          responsive
          bordered
          hover
          className="text-center table-sm"
        >
          <thead>
            <tr onClick={handleSort}>
              <th>Device</th>
              <th>Issue</th>
              <th>Type</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {requests ? (
              requests.map((request) => (
                <RequestRow
                  handleClick={handleClick}
                  key={request._id}
                  data={request}
                  user={user}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">You have no repairs.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default MyRepairsPage;
