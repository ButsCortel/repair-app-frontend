import React from "react";
import { Button, Card, Image, Badge } from "react-bootstrap";
import { FaCheck, FaEye, FaPlay } from "react-icons/fa";

const OnHoldCard = ({ request, history, handleUpdate }) => {
  return (
    <Card
      border={request.expedite ? "danger" : ""}
      className="onhold-card h-100 flex-shrink-0 mx-1"
    >
      <div className="d-flex h-100  w-100">
        <div className="badges">
          {request.status === "RECEIVED" ? (
            <Badge className="fs-6" variant="primary">
              RCV
            </Badge>
          ) : (
            <Badge className="fs-6" variant="danger">
              HOLD
            </Badge>
          )}
          {request.expedite ? (
            <Badge className="fs-6" variant="danger">
              EXP
            </Badge>
          ) : (
            ""
          )}
        </div>
        <div className="flex-shrink-0 mh-100 w-50 align-self-center">
          <Image className="onhold-image" src={request.image_url} />
        </div>
        <Card.Body className="p-1 flex-shrink-0 h-100 w-50">
          <div className="">
            <Card.Title className="w-100 mb-0">{request.device}</Card.Title>
            <Card.Text className="w-100 mb-0">{request.issue}</Card.Text>
            <div className="d-flex justify-content-around">
              <Button
                size="sm"
                onClick={() =>
                  handleUpdate("ONGOING", request.status, request._id)
                }
              >
                <FaPlay />
              </Button>

              <Button
                variant="success"
                disabled={request.status !== "ON HOLD"}
                size="sm"
                onClick={() =>
                  handleUpdate("OUTGOING", request.status, request._id)
                }
              >
                <FaCheck />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => history.push("/repairs/" + request._id)}
              >
                <FaEye />
              </Button>
            </div>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default React.memo(OnHoldCard);
