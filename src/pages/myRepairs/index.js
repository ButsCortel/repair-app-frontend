import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Spinner,
  Container,
  Badge,
  Image,
  Button,
} from "react-bootstrap";
import { FaCheck, FaPause, FaEye } from "react-icons/fa";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import Alert from "./components/Alert";
import UpdateModal from "./components/UpdateModal";
import OnHoldCard from "./components/OnHoldCard";
import TimeDisplay from "./components/TimeDisplay";

import "./index.css";

const MyRepairsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [transactions, setTransactions] = useState(null);
  const [requests, setRequests] = useState([]);
  const [transLoading, setTransLoading] = useState(false);
  const [repairLoading, setRepairLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [repair, setRepair] = useState(null);
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [prevStatus, setPrevStatus] = useState("");
  const [update, setUpdate] = useState({
    hasError: false,
    loading: false,
    errorMessage: "",
  });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn || user.type === "USER") return history.push("/login");
    if (user.type === "USER") return history.push("/");
    setRepairLoading(true);
    setRequestsLoading(true);
    getRepair();
    getRequests();
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (show) return setShow(false);
    if (showUpdate) {
      setShowUpdate(false);
      setUpdate({
        hasError: false,
        loading: false,
        errorMessage: "",
      });
    }
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  const handleSubmit = (note) => {
    setUpdate({
      ...update,
      loading: true,
    });
    if (!status)
      return setUpdate({
        ...update,
        hasError: true,
        errorMessage: "Missing required info!",
        loading: false,
      });
    api
      .put(
        "/requests/" + id,
        { status, prevStatus, note },
        { headers: { "auth-token": token } }
      )
      .then((res) => {
        getRepair();
        getRequests();
        getTransactions();
        setUpdate({
          ...update,
          hasError: false,
          errorMessage: "",
          loading: false,
        });
        setShowUpdate(false);
      })
      .catch((err) => {
        setUpdate({
          ...update,
          loading: false,
          hasError: true,
          errorMessage: err.response.data,
        });
      });
  };
  const getRepair = () => {
    api
      .get("/tech/ongoing", {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setRepair(response.data);
        setRepairLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        setRepairLoading(false);
      });
  };
  const getRequests = () => {
    api
      .get("/requests/all/CANSTART", {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setRequests(response.data);
        setRequestsLoading(false);
      })
      .catch((error) => {
        setRequests(null);
        setRequestsLoading(false);
      });
  };
  const getTransactions = () => {
    setTransLoading(true);
    api
      .get("/tech/requests/", {
        headers: { "auth-token": token },
      })
      .then((response) => {
        response.data.reverse();
        setTransactions(response.data);
        setTransLoading(false);
      })
      .catch((error) => {
        setTransLoading(false);
        console.log(error);
      });
  };

  // const handleSort = (event) => {
  //   const property = event.target.textContent.toLowerCase();
  //   const compare = (a, b) => {
  //     if (property === "type") {
  //       return b.expedite - a.expedite;
  //     }
  //     if (property === "update") {
  //       return new Date(b.lastUpdate) - new Date(a.lastUpdate);
  //     }
  //     if (a[property].toLowerCase() < b[property].toLowerCase()) return -1;
  //     if (a[property].toLowerCase() > b[property].toLowerCase()) return 1;
  //     return 0;
  //   };
  //   const sorted = requests.sort(compare);
  //   setRequests([...sorted]);
  // };

  const handleUpdate = (status, prevStatus, id) => {
    setStatus(status);
    setPrevStatus(prevStatus);
    setShowUpdate(true);
    setId(id);
    setUpdate({
      ...update,
      showUpdate: true,
    });
  };

  return (
    <Row className="myRepairs-row flex-column">
      <Alert handleClose={handleClose} show={show} />
      <Col className="flex-md-grow-0">
        <Container>
          <Row
            className={`ongoing-row rounded bg-light mb-2 ${
              repairLoading || !repair
                ? "justify-content-center align-items-center"
                : " justify-content-between"
            }`}
          >
            {repair && !repairLoading ? (
              <>
                <Col md={3} className="text-center d-flex align-items-center">
                  <Image
                    className="img-fluid mh-100 ongoing-image"
                    src={repair.image_url}
                    rounded
                    thumbnail
                  />
                </Col>
                <Col md={7} className="h-100">
                  <div className="d-md-flex flex-column h-100">
                    <div className="mw-100">
                      <span className="mw-100 repair-device">
                        {repair.device}
                      </span>
                      <div>
                        <Badge variant="warning">Ongoing</Badge>
                        {repair.expedite ? (
                          <Badge variant="danger">Expedite</Badge>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="d-md-flex repair-issue-body justify-content-around flex-grow-1">
                      <div className="w-50 repair-issue mh-100">
                        {repair.issue}
                      </div>
                      <div className="w-50 pl-2 mh-100">
                        <TimeDisplay repair={repair} />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={2} className="h-100">
                  <div className="h-100 d-flex flex-column justify-content-around">
                    <Button
                      value="ON HOLD"
                      onClick={() =>
                        handleUpdate("ON HOLD", repair.status, repair._id)
                      }
                      variant="danger"
                      size="sm"
                    >
                      Hold <FaPause />
                    </Button>
                    <Button
                      value="OUTGOING"
                      onClick={() =>
                        handleUpdate("OUTGOING", repair.status, repair._id)
                      }
                      variant="success"
                      size="sm"
                    >
                      Finish <FaCheck />
                    </Button>

                    <Button
                      onClick={() => history.push("/repairs/" + repair._id)}
                      variant="secondary"
                      size="sm"
                    >
                      View <FaEye />
                    </Button>
                  </div>
                </Col>
              </>
            ) : repairLoading ? (
              <div className="text-center text-muted">
                <p>Checking Ongoing request...</p>
              </div>
            ) : (
              <p>No ongoing repair.</p>
            )}
          </Row>
          <UpdateModal
            show={showUpdate}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            state={update}
            status={status}
          />
          <Row className="p-2 onhold-row rounded bg-light mb-2">
            <Col className="h-100">
              {!requestsLoading && requests ? (
                <div className="onhold-div d-flex h-100">
                  {requests.map((request) => {
                    return (
                      <OnHoldCard
                        key={request._id}
                        request={request}
                        handleUpdate={handleUpdate}
                        history={history}
                      />
                    );
                  })}
                </div>
              ) : !requestsLoading && !requests ? (
                <div className="d-flex justify-content-center d-flex align-items-center h-100">
                  <p>There are no available requests yet.</p>
                </div>
              ) : (
                <div className="text-muted d-flex justify-content-center align-items-center h-100">
                  <p>Loading available requests...</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </Col>
      <Col className="col-table-myRepairs flex-grow-1">
        <div className="d-flex flex-column h-100">
          <h6>Previous transactions</h6>
          <div className="table-div-myRepairs table-responsive-lg">
            <table className="table myRepairs table-hover text-center">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions && !transLoading ? (
                  transactions.map((transaction) => (
                    <RequestRow
                      handleClick={handleClick}
                      key={transaction._id}
                      data={transaction}
                      setShow={setShow}
                    />
                  ))
                ) : transLoading ? (
                  <tr>
                    <td style={{ pointerEvents: "none" }} colSpan="5">
                      <Spinner
                        animation="border"
                        style={{ height: "4em", width: "4em" }}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td style={{ pointerEvents: "none" }} colSpan="5">
                      You have no recent transaction.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default MyRepairsPage;
