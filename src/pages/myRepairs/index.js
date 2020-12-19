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
import OnHoldCard from "./components/OnHoldCard";
import "./index.css";

const MyRepairsPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [repairLoading, setRepairLoading] = useState(false);
  const [repair, setRepair] = useState(null);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isLoggedIn || user.type === "USER") return history.push("/login");
    if (user.type === "USER") return history.push("/");
    getRepairs();
  }, []);

  const handleClose = () => {
    setShow(false);
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
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
  const getRepairs = async () => {
    setLoading(true);
    setRepairLoading(true);
    try {
      api
        .get("/tech/ongoing", {
          headers: { "auth-token": token },
        })
        .then((response) => {
          setRepair(response.data);
          setRepairLoading(false);
          api
            .get("/tech/requests/", {
              headers: { "auth-token": token },
            })
            .then((response) => {
              response.data.reverse();
              setRequests(response.data);
              setLoading(false);
            });
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
                <Col md={3} className="h-100">
                  <Image
                    className="img-fluid mh-100"
                    src={repair.image_url}
                    rounded
                    thumbnail
                  />
                </Col>
                <Col md={7} className="h-100">
                  <Badge variant="warning">Ongoing</Badge>
                  <p>{repair.device}</p>
                </Col>
                <Col md={2} className="h-100">
                  <div className="h-100 d-flex flex-column justify-content-around">
                    <Button variant="danger" size="sm">
                      Hold <FaPause />
                    </Button>
                    <Button variant="info" size="sm">
                      Outgoing <FaCheck />
                    </Button>
                    <Button variant="secondary" size="sm">
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
          <Row className="p-2 onhold-row rounded bg-light mb-2 justify-content-between">
            {}
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
                    <td colSpan="5">You have no requests.</td>
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
