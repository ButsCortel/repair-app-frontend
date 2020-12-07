import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../../session-context";
import { Container, Row, Col, Badge, Button, Form } from "react-bootstrap";
import api from "../../services/api";
import moment from "moment";
import "./index.css";
const RequestItemPage = ({ history }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { isLoggedIn, statusColor } = useContext(SessionContext);
  const [repair, setRepair] = useState(null);
  const { id } = useParams();
  const [state, setState] = useState({
    status: "",
    note: "",
    repairId: "",
    success: false,
    hasError: false,
    errorMessage: "",
  });
  const handleChange = (event) => {
    const { value, name } = event.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { status, note } = state;
    if (!status || !note) return alert("Missing information!");
    try {
      const response = await api.put(
        "/requests/" + repair._id,
        { status, note },
        { headers: { "auth-token": token } }
      );
      setState({
        status: "",
        note: "",
        repairId: "",
        success: true,
        hasError: false,
        errorMessage: "",
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setState({
        ...state,
        hasError: true,
        errorMessage: "Missing Information!",
        success: false,
      });
    }
  };
  const getRepair = async () => {
    try {
      const response = await api.get("/requests/" + id, {
        headers: { "auth-token": token },
      });
      console.log(user);
      setRepair(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  let mounted;
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepair();
  }, []);

  const newDate = (date) => {
    const original = moment(date);
    return original.format("MMM Do YYYY, h:mm:ss a");
  };
  return !repair ? null : (
    <>
      <Row className="text-center justify-content-between align-items-start mh-100">
        <Col md={12} lg={6}>
          <div className="product-img d-table-cell d-sm-block">
            <img className="mh-100 mw-100" src={repair.image_url} />
          </div>
        </Col>
        <Col md={12} lg={6}>
          <Container className="details-body text-left">
            <h4>{repair.device}</h4>
            <div className="text-left">
              <Badge variant={statusColor(repair.status)}>
                {repair.status}
              </Badge>
              <Badge
                className="ml-1"
                variant={repair.expedite ? "danger" : "primary"}
              >
                {repair.expedite ? "EXPEDITE" : "REGULAR"}
              </Badge>
            </div>
            <Row>
              <Col>
                <ul>
                  <li>Created</li>
                  <li>{newDate(repair.dateCreated)}</li>
                  <li>Requestor</li>
                  <li className="li-container position-relative">
                    {repair.customer.firstName} {repair.customer.lastName}
                    <a
                      className="email"
                      href={`mailto:${repair.customer.email}`}
                    >
                      {repair.customer.email}
                    </a>
                  </li>
                </ul>
              </Col>
              <Col>
                <ul>
                  <li>Updated</li>
                  <li>{newDate(repair.lastUpdate)}</li>
                  <li>Last User</li>
                  <li className="li-container position-relative">
                    {repair.user.firstName} {repair.user.lastName}
                    <a className="email" href={`mailto:${repair.user.email}`}>
                      {repair.user.email}
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
            <ul>
              <li>Issue/Description</li>
              <li className="issue overflow-auto">{repair.issue}</li>
            </ul>
            <Row className="justify-content-center">
              <Col>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="status">
                    <Form.Control
                      name="status"
                      value={state.status}
                      className={`d-inline-block w-auto ${
                        state.status === "DELETE" ? "border border-danger" : ""
                      }`}
                      as="select"
                      onChange={handleChange}
                      required
                      disabled={
                        user._id !== repair.customer._id && user.type === "USER"
                      }
                    >
                      <option value="" default>
                        Update Status:
                      </option>
                      {user.type !== "USER" ? (
                        <>
                          <option value="RECEIVED" default>
                            RECEIVED
                          </option>
                          <option value="ONGOING" default>
                            ONGOING
                          </option>
                          <option value="ON HOLD" default>
                            ON HOLD
                          </option>
                          <option value="OUTGOING" default>
                            OUTGOING
                          </option>
                          <option value="COMPLETED" default>
                            COMPLETED
                          </option>
                        </>
                      ) : (
                        ""
                      )}
                      {user.type === "ADMIN" ||
                      user._id === repair.customer._id ? (
                        <>
                          <option value="CANCELLED" default>
                            CANCEL
                          </option>
                          <option
                            className="bg-danger text-white"
                            value="DELETE"
                            default
                          >
                            DELETE
                          </option>
                        </>
                      ) : (
                        ""
                      )}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="" controlId="note">
                    <Form.Control
                      placeholder="Note:"
                      as="textarea"
                      name="note"
                      value={state.note}
                      rows={3}
                      onChange={handleChange}
                      disabled={!state.status}
                      required
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Button
                        type="submit"
                        className="mx-1 w-25"
                        disabled={!state.status || !state.note}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="danger"
                        className="mx-2 w-25"
                        disabled={!state.status || !state.note}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
                    {state.hasError ? state.errorMessage : ""}
                  </Form.Text>
                  <Form.Text className="status font-weight-bold position-absolute text-success text-center">
                    {state.success ? "Request updated! Loading..." : ""}
                  </Form.Text>
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default RequestItemPage;
