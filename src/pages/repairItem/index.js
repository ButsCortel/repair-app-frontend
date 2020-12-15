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
import CancelModal from "./Components/CancelModal";

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
  const [showCancel, setShowCancel] = useState(false);
  const [state, setState] = useState({
    status: "",
    note: "",
    loading: false,
    hasError: false,
    errorMessage: "",
  });
  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepair();
  }, []);
  const getRepair = async () => {
    try {
      api
        .get("/requests/" + id, {
          headers: { "auth-token": token },
        })
        .then((response) => {
          setRepair(response.data.repair);
          const { history } = response.data;
          if (history) history.reverse();
          setTransactions(history);
          setShowCancel(false);
          setShowUpdate(false);
          setState({
            status: "",
            note: "",
            loading: false,
            hasError: false,
            errorMessage: "",
          });
        });
    } catch (error) {
      console.log(error);
      history.push("/");
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async (event) => {
    const { status, note } = state;
    if (!status || !note)
      return setState({
        ...state,
        hasError: true,
        errorMessage: "Missing Information!",
        loading: false,
      });
    try {
      setState({
        ...state,
        loading: true,
        hasError: false,
        errorMessage: "",
      });

      const response = await api
        .put(
          "/requests/" + repair._id,
          { status, note, user },
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          getRepair();
        })
        .catch((error) => {
          console.log(error);
          setState({
            ...state,
            hasError: true,
            errorMessage: "Already occupied!",
            loading: false,
          });
        });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        hasError: true,
        errorMessage: "Missing Information!",
        loading: false,
      });
    }
  };
  const handleDelete = () => {
    try {
      setState({ ...state, loading: true });
      api
        .delete("/requests/delete/" + repair._id, {
          headers: { "auth-token": token },
        })
        .then((res) => {
          history.push("/");
        });
    } catch (error) {
      console.log(error.response);
      setState({
        ...state,
        loading: false,
        hasError: true,
        errorMessage: "Error deleting request!",
      });
    }
  };
  const handleUpdateClose = () => {
    setShowUpdate(false);
    setState({
      status: "",
      note: "",
      loading: false,
      hasError: false,
      errorMessage: "",
    });
  };
  const handleDeleteClose = () => {
    setShowDelete(false);
  };
  const handleCancelClose = () => {
    setShowCancel(false);
    setState({
      status: "",
      note: "",
      loading: false,
      hasError: false,
      errorMessage: "",
    });
  };
  const handleCancelShow = () => {
    setState({
      ...state,
      status: "CANCELLED",
    });
    setShowCancel(true);
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
                <div className="mb-2 d-flex justify-content-around align-items-baseline">
                  <Button
                    className={`rounded-pill mb-sm-0 ${
                      user.type === "USER" ? "d-none" : ""
                    }`}
                    title="Update request"
                    variant="outline-primary"
                    onClick={() => setShowUpdate(true)}
                  >
                    Update
                    <MdUpdate
                      title="Update request"
                      style={{ verticalAlign: "text-top" }}
                    />
                  </Button>
                  <Button
                    className={`rounded-pill mb-sm-0 ${
                      repair.status === "CANCELLED"
                        ? "d-none"
                        : user.type === "ADMIN"
                        ? ""
                        : user._id !== repair.customer._id
                        ? "d-none"
                        : ""
                    }`}
                    title="Cancel request"
                    variant="outline-warning"
                    onClick={handleCancelShow}
                  >
                    Cancel
                    <MdCancel
                      title="Cancel request"
                      style={{ verticalAlign: "text-top" }}
                    />
                  </Button>
                  <Button
                    className={`rounded-pill  ${
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
                    title="Delete request"
                    variant="outline-danger"
                    onClick={() => setShowDelete(true)}
                  >
                    Delete
                    <MdDeleteForever
                      title="Delete request"
                      style={{ verticalAlign: "text-top" }}
                    />
                  </Button>
                </div>

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
                  loading={state.loading}
                  show={showDelete}
                  handleClose={handleDeleteClose}
                  handleDelete={handleDelete}
                />
                <CancelModal
                  state={state}
                  show={showCancel}
                  handleClose={handleCancelClose}
                  handleChange={handleChange}
                  handleCancel={handleSubmit}
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
