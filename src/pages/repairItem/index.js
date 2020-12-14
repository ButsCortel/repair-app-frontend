import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../../session-context";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { MdDeleteForever, MdUpdate, MdCancel } from "react-icons/md";

//Dependencies
import api from "../../services/api";
import moment from "moment";
//Components
import HistoryRow from "./Components/HistoryRow";
import UpdateModal from "./Components/UpdateModal";

import "./index.css";
import DeleteModal from "./Components/DeleteModal";
const RequestItemPage = ({ history }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { isLoggedIn, statusColor } = useContext(SessionContext);
  const [repair, setRepair] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const { id } = useParams();
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
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
  const handleDelete = () => {
    api
      .delete("/requests/delete/" + repair._id, {
        headers: { "auth-token": token },
      })
      .then((res) => history.push("/"));
  };
  const handleSubmit = async (event) => {
    const { status, note } = state;
    if (!status || !note) return alert("Missing information!");
    try {
      setState({
        ...state,
        success: true,
        hasError: false,
        errorMessage: "",
      });

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
  const handleUpdateClose = () => {
    setShowUpdate(false);
    setState({
      status: "",
      note: "",
      repairId: "",
      success: false,
      hasError: false,
      errorMessage: "",
    });
  };
  const handleDeleteClose = () => {
    setShowDelete(false);
  };

  const newDate = (date) => {
    const original = moment(date);
    return original.format("MMM DD YYYY, h:mm:ss a");
  };
  const options = (status) => {
    if (user.type === "ADMIN")
      return (
        <>
          <option value="RECEIVED">RECEIVED</option>
          <option value="ONGOING">ONGOING</option>
          <option value="ON HOLD">ON HOLD</option>
          <option value="OUTGOING">OUTGOING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCEL</option>
        </>
      );
    if (user.type === "TECH") {
      return (
        <>
          <option
            className={status !== "INCOMING" ? "d-none" : ""}
            value="RECEIVED"
          >
            RECEIVED
          </option>
          <option
            className={
              status !== "RECEIVED" && status !== "ON HOLD" ? "d-none" : ""
            }
            value="ONGOING"
          >
            ONGOING
          </option>
          <option
            className={status !== "ONGOING" ? "d-none" : ""}
            value="ON HOLD"
          >
            ON HOLD
          </option>
          <option
            className={
              status !== "ON HOLD" && status !== "ONGOING" ? "d-none" : ""
            }
            value="OUTGOING"
          >
            OUTGOING
          </option>
          <option
            className={status !== "OUTGOING" ? "d-none" : ""}
            value="COMPLETED"
          >
            COMPLETED
          </option>
        </>
      );
    }
  };
  return !repair ? null : (
    <>
      <Row className="repair-item-row text-center justify-content-between align-items-stretch  h-100">
        <Col md={12} lg={6}>
          <div className="repair-item-info d-flex flex-column">
            <div className="product-img-repairItem d-flex justify-content-center align-items-center mw-100">
              <img
                alt="device"
                className="mh-100 mw-100"
                src={repair.image_url}
              />
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
                <Container className="mb-2">
                  <Row className="justify-content-around">
                    <Button
                      className={`col-sm-3 mb-2 mb-sm-0 ${
                        user.type === "USER" ? "d-none" : ""
                      }`}
                      variant="primary"
                      onClick={() => setShowUpdate(true)}
                    >
                      Update
                      <MdUpdate style={{ verticalAlign: "baseline" }} />
                    </Button>
                    <Button
                      className={`col-sm-3 mb-2 mb-sm-0 ${
                        user.type === "ADMIN"
                          ? ""
                          : user._id !== repair.customer._id
                          ? "d-none"
                          : ""
                      }`}
                      variant="secondary"
                    >
                      Cancel
                      <MdCancel style={{ verticalAlign: "baseline" }} />
                    </Button>
                    <Button
                      className={`col-sm-3 ${
                        user.type === "ADMIN"
                          ? ""
                          : user._id !== repair.customer._id
                          ? "d-none"
                          : ""
                      }`}
                      disabled={
                        user.type === "ADMIN"
                          ? false
                          : user._id === repair.customer._id
                          ? false
                          : repair.status === "INCOMING"
                          ? false
                          : true
                      }
                      variant="danger"
                      onClick={() => setShowDelete(true)}
                    >
                      Delete
                      <MdDeleteForever style={{ verticalAlign: "baseline" }} />
                    </Button>
                  </Row>
                </Container>

                <UpdateModal
                  state={state}
                  show={showUpdate}
                  user={user}
                  repair={repair}
                  options={options}
                  handleChange={handleChange}
                  handleClose={handleUpdateClose}
                  handleSubmit={handleSubmit}
                />
                <DeleteModal
                  show={showDelete}
                  handleClose={handleDeleteClose}
                  handleDelete={handleDelete}
                />
              </Col>
              <Col className="col-table-repairItem flex-grow-1">
                <div className="table-div-repairItem table-responsive-sm">
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
