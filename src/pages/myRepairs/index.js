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
import { FaCheck, FaPause, FaEye, FaRegQuestionCircle } from "react-icons/fa";
import api from "../../services/api";
import { SessionContext } from "../../session-context";
import RequestRow from "./components/RequestRow";
import Alert from "./components/Alert";
import UpdateModal from "./components/UpdateModal";
import OnHoldCard from "./components/OnHoldCard";
import moment from "moment";
import "./index.css";

const MyRepairsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [repairLoading, setRepairLoading] = useState(false);
  const [repair, setRepair] = useState(null);
  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState({
    showUpdate: false,
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
    getRepair();
    getTransactions();
    const interval = setInterval(() => {
      getRepair();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    if (show) return setShow(false);
    if (update.showUpdate)
      return setUpdate({
        showUpdate: false,
        hasError: false,
        loading: false,
        errorMessage: "",
        note: "",
        status: "",
      });
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  const handleSubmit = (status, note) => {
    setUpdate({
      ...update,
      loading: true,
      hasError: false,
      errorMessage: "",
    });
    if (!status || !note)
      return setUpdate({
        ...update,
        hasError: true,
        errorMessage: "Missing required info!",
        loading: false,
      });
    api
      .put(
        "/requests/" + repair._id,
        { status, prevStatus: repair.status, note },
        { headers: { "auth-token": token } }
      )
      .then((res) => {
        getRepair();
        getTransactions();
      })
      .catch((err) => {
        setUpdate({
          ...update,
          loading: false,
          hasError: true,
          errorMessage: err.response.message,
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
        setRepairLoading(false);
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
  const getTransactions = async () => {
    setLoading(true);
    api
      .get("/tech/requests/", {
        headers: { "auth-token": token },
      })
      .then((response) => {
        response.data.reverse();
        setRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const timeElapsed = (lastUpdate) => {
    const timeDiff = Date.now() - Date.parse(lastUpdate);
    const duration = moment.duration(timeDiff);
    return `${
      Math.floor(duration.asDays())
        ? Math.floor(duration.asDays()).toString() + " d "
        : ""
    } ${Math.floor(duration.asHours())} hr ${moment
      .utc(timeDiff)
      .format("mm")} min`;
  };
  const timeOngoing = (ongoing, lastUpdate) => {
    const timeDiff = ongoing + (Date.now() - Date.parse(lastUpdate));
    const duration = moment.duration(timeDiff);
    return `${
      Math.floor(duration.asDays())
        ? Math.floor(duration.asDays()).toString() + " d "
        : ""
    } ${Math.floor(duration.asHours())} hr ${moment
      .utc(timeDiff)
      .format("mm")} min`;
  };

  return (
    <Row className="myRepairs-row flex-column">
      <Alert handleClose={handleClose} show={show} />
      <Col className="flex-md-grow-0">
        <Container>
          <Row
            className={`p-2 ongoing-row rounded bg-light mb-2 ${
              repairLoading || !repair
                ? "justify-content-center align-items-center"
                : " justify-content-between"
            }`}
          >
            {repair && !repairLoading ? (
              <>
                <Col md={3} className="h-100 text-center">
                  <Image
                    className="img-fluid mh-100"
                    src={repair.image_url}
                    rounded
                    thumbnail
                  />
                </Col>
                <Col md={7} className="h-100">
                  <div className="d-md-flex flex-column h-100">
                    <div className="mw-100">
                      <div>{repair.device}</div>
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
                        <ul>
                          <li title="Time spent working (ONGOING)">
                            Time spent:
                            <FaRegQuestionCircle
                              style={{ verticalAlign: "baseline" }}
                            />
                          </li>
                          <li>
                            {repair.totalOngoing
                              ? timeOngoing(
                                  repair.totalOngoing,
                                  repair.lastUpdate
                                )
                              : timeElapsed(repair.lastUpdate)}
                          </li>
                          <li title="Time elapsed from start (INCOMING)">
                            Total time:
                            <FaRegQuestionCircle
                              style={{ verticalAlign: "baseline" }}
                            />
                          </li>
                          <li>{timeElapsed(repair.dateCreated)}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={2} className="h-100">
                  <div className="h-100 d-flex flex-column justify-content-around">
                    <Button
                      value="ON HOLD"
                      onClick={() =>
                        setUpdate({
                          ...update,
                          status: "ON HOLD",
                          showUpdate: true,
                        })
                      }
                      variant="danger"
                      size="sm"
                    >
                      Hold <FaPause />
                    </Button>
                    <Button
                      value="OUTGOING"
                      onClick={() =>
                        setUpdate({
                          ...update,
                          status: "OUTGOING",
                          showUpdate: true,
                        })
                      }
                      variant="success"
                      size="sm"
                    >
                      Finish <FaCheck />
                    </Button>
                    <UpdateModal
                      show={update.showUpdate}
                      handleClose={handleClose}
                      handleSubmit={handleSubmit}
                      state={update}
                    />
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
          <Row className="p-2 onhold-row rounded bg-light mb-2 justify-content-between"></Row>
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
                {requests && !loading ? (
                  requests.map((request) => (
                    <RequestRow
                      handleClick={handleClick}
                      key={request._id}
                      data={request}
                      setShow={setShow}
                    />
                  ))
                ) : loading ? (
                  <tr>
                    <td colSpan="5">
                      <Spinner
                        animation="border"
                        style={{ height: "4em", width: "4em" }}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5">You have no recent transaction.</td>
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
