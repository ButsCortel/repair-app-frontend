import React, { useContext, useEffect, useState, useMemo } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { MdAddToQueue } from "react-icons/md";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import RequestModal from "./components/RequestModal";
import "./index.css";

const MyRequestsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [show, setShow] = useState(false);
  const [requests, setRequests] = useState(null);
  const [state, setState] = useState({
    device: "",
    issue: "",
    image: null,
    expedite: "No",
    hasError: false,
    errorMessage: "",
  });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
  }, []);

  const preview = useMemo(() => {
    return state.image ? URL.createObjectURL(state.image) : null;
  }, [state.image]);
  const handleChange = (event) => {
    const { value, name, files } = event.target;
    if (files) return setState({ ...state, [name]: files[0] });
    setState({ ...state, [name]: value });
  };
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
    const sorted = [...requests].sort(compare);
    setRequests([...sorted]);
  };
  const handleSubmit = async () => {
    const repairData = new FormData();

    try {
      if (state.device && state.issue && state.image) {
        repairData.append("device", state.device);
        repairData.append("customer", user._id);
        repairData.append("issue", state.issue);
        repairData.append("image", state.image);
        repairData.append("expedite", state.expedite);
        api
          .post("/requests/create", repairData, {
            headers: { "auth-token": token },
          })
          .then(
            (value) => {
              getRepairs();
              setShow(false);
            },
            (error) => {
              console.log(error);
            }
          );
        // setState({
        //   device: "",
        //   issue: "",
        //   image: null,
        //   expedite: "No",
        //   hasError: false,
        //   errorMessage: "",
        // });
      } else {
        setState({
          ...state,
          success: false,
          hasError: true,
          errorMessage: "Missing required information!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleHide = () => {
    setState({
      device: "",
      issue: "",
      image: null,
      expedite: "No",
      success: false,
      hasError: false,
      errorMessage: "",
    });
    setShow(false);
  };
  const getRepairs = async () => {
    try {
      const response = await api.get("/user/requests/", {
        headers: { "auth-token": token },
      });
      setRequests([...response.data.repairs]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Row className="justify-content-between align-items-center">
      <Col>
        <Button
          onClick={() => setShow(true)}
          className="new-request d-block ml-auto mb-2 rounded-pill"
        >
          Create New <MdAddToQueue className="ml-1" />
        </Button>
        <RequestModal
          show={show}
          onHide={handleHide}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          state={state}
          preview={preview}
        />
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
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">You have no requests.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default MyRequestsPage;
