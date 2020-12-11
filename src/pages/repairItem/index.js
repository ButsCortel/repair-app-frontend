import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../../session-context";
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import api from "../../services/api";
import moment from "moment";
import HistoryRow from "./Components/HistoryRow";
import "./index.css";
const RequestItemPage = ({ history }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { isLoggedIn, statusColor } = useContext(SessionContext);
  const [repair, setRepair] = useState(null);
  const [transactions, setTransactions] = useState(null);
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
        ...state,
        success: true,
        hasError: false,
        errorMessage: "",
      });
      setTimeout(() => {
        getRepair();
        setState({
          status: "",
          note: "",
          repairId: "",
          success: false,
          hasError: false,
          errorMessage: "",
        });
      }, 2000);
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
      console.log(response.data);
      setRepair(response.data.repair);
      const { history } = response.data;
      if (history) return setTransactions(history.reverse());
      setTransactions(response.data.history);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepair();
  }, []);

  const newDate = (date) => {
    const original = moment(date);
    return original.format("MMM DD YYYY, h:mm:ss a");
  };
  return !repair ? null : (
    <>
      <Row className="repair-item-row text-center justify-content-between align-items-stretch h-100">
        <Col md={12} lg={6}>
          <div className="product-img-repairItem d-table-cell d-sm-block">
            <img className="mh-100 mw-100" src={repair.image_url} />
          </div>
          <h4>{repair.device}</h4>

          <Container className="details-body-repairItem text-left">
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
            <div className="d-flex justify-content-between">
              <ul className="mb-0">
                <li>Created</li>
                <li>{newDate(repair.dateCreated)}</li>
                <li>Requestor</li>
                <li className="li-container position-relative">
                  {repair.customer.firstName} {repair.customer.lastName}
                  <a className="email" href={`mailto:${repair.customer.email}`}>
                    {repair.customer.email}
                  </a>
                </li>
              </ul>
              <ul className="mb-0">
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
            </div>
            <ul>
              <li>Issue/Description</li>
              <li className="issue-repairItem">{repair.issue}</li>
            </ul>
          </Container>
        </Col>
        <Col md={12} lg={6}>
          <Container className="h-100">
            <Row className="transactions-row flex-column pt-0 mh-100">
              <Col className="flex-grow-0">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="text-left" controlId="status">
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
                      disabled={!state.status || state.success}
                      required
                    />
                    <div className="d-flex justify-content-end mt-2">
                      {state.success ? <Spinner animation="border" /> : ""}
                      <Button
                        type="submit"
                        className="mx-1 w-25"
                        disabled={!state.status || !state.note || state.success}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="danger"
                        className="mx-2 w-25"
                        disabled={!state.status || !state.note || state.success}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
                    {state.hasError ? state.errorMessage : ""}
                  </Form.Text>
                </Form>
              </Col>
              <Col className="col-table-repairItem flex-grow-1">
                {/* <h5>Previous Transactions</h5> */}
                <div className="table-div-repairItem">
                  <table className="table repairItem text-center">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions ? (
                        transactions.map((data) => (
                          <HistoryRow key={data._id} data={data} />
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default RequestItemPage;
