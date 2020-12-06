import React, { useState, useContext } from "react";
import { Badge, Card } from "react-bootstrap";
import { SessionContext } from "../../../session-context";
import moment from "moment";
import { useHistory } from "react-router-dom";

const RepairCard = ({ data }) => {
  const history = useHistory();
  const { statusColor } = useContext(SessionContext);
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  return (
    <Card
      onClick={() => handleClick(data._id)}
      bg="light"
      border={data.expedite ? "danger" : "secondary"}
      className="my-2 p-1 mx-auto"
    >
      <Card.Header
        title={data.device}
        className="text-center mb-1 font-weight-bold "
      >
        {data.device}
      </Card.Header>
      <div
        style={{ backgroundImage: `url(${data.image_url})` }}
        className="card-img-top mx-auto border border-light rounded"
      ></div>
      <Card.Body className="p-2">
        <div className="small text-center">
          <Badge variant={statusColor(data.status)}>{data.status}</Badge>
          <Badge variant={data.expedite ? "danger" : "secondary"}>
            {data.expedite ? "EXPEDITE" : "REGULAR"}
          </Badge>
        </div>
        <div className="scroll">
          <Card.Text className="small mb-1">{data.issue}</Card.Text>
        </div>
        <Card.Footer className="small mb-1">
          Updated {moment(data.lastUpdate).fromNow()}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};
export default RepairCard;
