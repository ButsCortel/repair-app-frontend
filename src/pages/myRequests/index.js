import React, { useContext, useEffect, useState, useMemo } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { MdAddToQueue } from "react-icons/md";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import RequestModal from "./components/RequestModal";
import "./index.css";

const MyRequestsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    device: "",
    issue: "",
    image: null,
    expedite: "No",
  });
  const [requests, setRequests] = useState(null);
  const [state, setState] = useState({
    hasError: false,
    errorMessage: "",
    uploading: false,
    loading: false,
  });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
  }, []);

  const preview = useMemo(() => {
    return form.image ? URL.createObjectURL(form.image) : null;
  }, [form.image]);
  const handleChange = (event) => {
    const { value, name, files } = event.target;
    if (files) return setForm({ ...form, [name]: files[0] });
    setForm({ ...form, [name]: value });
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  const handleSort = (event) => {
    if (requests) {
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
    }
  };
  const handleSubmit = async () => {
    const repairData = new FormData();

    try {
      if (form.device && form.issue && form.image) {
        repairData.append("device", form.device);
        repairData.append("customer", user._id);
        repairData.append("issue", form.issue);
        repairData.append("image", form.image);
        repairData.append("expedite", form.expedite);
        setState({
          loading: false,
          hasError: false,
          uploading: true,
          errorMessage: "",
        });
        api
          .post("/requests/create", repairData, {
            headers: { "auth-token": token },
          })
          .then(
            (value) => {
              setState({
                hasError: false,
                errorMessage: "",
                uploading: false,
                loading: false,
              });
              getRepairs();
              setShow(false);
              setForm({ device: "", issue: "", image: null, expedite: "No" });
            },
            (error) => {
              console.log(error);
              setState({
                loading: false,
                uploading: false,
                hasError: true,
                errorMessage: error.response.data,
              });
            }
          );
      } else {
        setState({
          loading: false,
          uploading: false,
          hasError: true,
          errorMessage: "Missing required Information!",
        });
      }
    } catch (error) {
      setState({
        loading: false,
        uploading: false,
        hasError: true,
        errorMessage: error.response.data,
      });
    }
  };
  const handleHide = () => {
    setState({
      uploading: false,
      hasError: false,
      errorMessage: "",
      loading: false,
    });
    setForm({ device: "", issue: "", image: null, expedite: "No" });
    setShow(false);
  };
  const getRepairs = async () => {
    setState({ ...state, loading: true });
    try {
      const response = await api.get("/user/requests/", {
        headers: { "auth-token": token },
      });
      setRequests([...response.data]);
      setState({ ...state, loading: false });
    } catch (error) {
      setState({ ...state, loading: false });
      console.log(error);
    }
  };
  return (
    <Row className="flex-column h-100">
      <Col className="flex-grow-0">
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
          form={form}
          preview={preview}
        />
      </Col>

      <Col className="col-table-myRequests flex-grow-1">
        <div className="table-div-myRequests table-responsive-lg h-100">
          <table className="table myRequests table-hover text-center">
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
              {!state.loading && requests ? (
                requests.map((request) => (
                  <RequestRow
                    handleClick={handleClick}
                    key={request._id}
                    data={request}
                  />
                ))
              ) : state.loading ? (
                <tr>
                  <td colSpan="5">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5">You have no requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
};

export default MyRequestsPage;
