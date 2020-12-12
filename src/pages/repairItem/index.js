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
      setState({
        ...state,
        success: true,
        hasError: false,
        errorMessage: "",
      });
      if (status === "DELETE") {
        return api
          .delete("/requests/delete/" + repair._id, {
            headers: { "auth-token": token },
          })
          .then((res) => history.push("/"));
      }

      api
        .put(
          "/requests/" + repair._id,
          { status, note },
          { headers: { "auth-token": token } }
        )
        .then((data) => {
          getRepair();
          setState({
            status: "",
            note: "",
            repairId: "",
            success: false,
            hasError: false,
            errorMessage: "",
          });
        });
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
  const options = (customer, status) => {
    if (user.type === "USER" && customer === user._id) {
      return (
        <>
          <option
            disabled={status === "OUTGOING" || status === "COMPLETED"}
            value="CANCELLED"
          >
            CANCEL
          </option>
          <option
            disabled={status === "OUTGOING" || status === "COMPLETED"}
            value="DELETE"
          >
            DELETE
          </option>
        </>
      );
    }
    if (user.type === "TECH") {
      return (
        <>
          <option
            className={status !== "INCOMING" ? "hidden" : ""}
            value="RECEIVED"
          >
            RECEIVED
          </option>
          <option
            className={
              status !== "RECEIVED" && status !== "ON HOLD" ? "hidden" : ""
            }
            value="ONGOING"
          >
            ONGOING
          </option>
          <option
            className={status !== "ONGOING" ? "hidden" : ""}
            value="ON HOLD"
          >
            ON HOLD
          </option>
          <option
            className={
              status !== "ON HOLD" && status !== "ONGOING" ? "hidden" : ""
            }
            value="OUTGOING"
          >
            OUTGOING
          </option>
          <option
            className={status !== "OUTGOING" ? "hidden" : ""}
            value="COMPLETED"
          >
            COMPLETED
          </option>
        </>
      );
    }
    return (
      <>
        <option value="RECEIVED">RECEIVED</option>
        <option value="ONGOING">ONGOING</option>
        <option value="ON HOLD">ON HOLD</option>
        <option value="OUTGOING">OUTGOING</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCEL</option>
        <option value="DELETE">DELETE</option>
      </>
    );
  };
  return !repair ? null : (
    <>
      <Row className="repair-item-row text-center justify-content-between align-items-stretch  h-100">
        <Col md={12} lg={6}>
          <div className="repair-item-info d-flex flex-column">
            <div className="product-img-repairItem d-flex justify-content-center align-items-center mw-100">
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
              <div className="d-flex flex-column flex-sm-row justify-content-between mh-100">
                <ul className="mb-0">
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
                <ul className="mb-0">
                  <li>Updated</li>
                  <li>
                    {repair.dateCreated !== repair.lastUpdate
                      ? newDate(repair.lastUpdate)
                      : "N/A"}
                  </li>
                  <li>Last User</li>
                  <li className="li-container position-relative">
                    {repair.user.firstName} {repair.user.lastName}
                    <a className="email" href={`mailto:${repair.user.email}`}>
                      {repair.user.email}
                    </a>
                  </li>
                </ul>
              </div>
              <ul className="issue-ul mb-0 flex-grow-1">
                <li>Issue/Description</li>
                <li className="issue-repairItem">{repair.issue}</li>
              </ul>
            </Container>
          </div>
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
                      {options(repair.customer._id, repair.status)}
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
                <div className="table-div-repairItem border table-responsive-sm">
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
