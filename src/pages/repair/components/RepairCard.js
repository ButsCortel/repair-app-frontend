import React, { useState, useContext } from "react";
import { Badge, Card } from "react-bootstrap";
import { SessionContext } from "../../../session-context";
import moment from "moment";
import { useHistory } from "react-router-dom";

const RepairCard = ({ data, handleClick }) => {
  const history = useHistory();
  const { statusColor } = useContext(SessionContext);

  return (
    <Card
      onClick={() => handleClick(data._id)}
      bg="light"
      border={
        data.status === "COMPLETED"
          ? "success"
          : data.expedite
          ? "danger"
          : data.status === "CANCELLED"
          ? ""
          : "primary"
      }
      className="my-2 p-1 mx-auto mw-100"
    >
      <Card.Header
        title={data.device}
        className="device-name text-center mb-1 font-weight-bold "
      >
        {data.device}
      </Card.Header>
      <img
        src={data.image_url}
        className="card-img border border-light rounded"
      />
      <Card.Body className="p-2">
        <div className="small text-center">
          <Badge className="mx-1" variant={statusColor(data.status)}>
            {data.status}
          </Badge>
          <Badge
            className="mx-1"
            variant={data.expedite ? "danger" : "primary"}
          >
            {data.expedite ? "EXPEDITE" : "REGULAR"}
          </Badge>
        </div>
        <div className="scroll">
          <Card.Text className="small mb-1">{data.issue}</Card.Text>
        </div>
        <Card.Footer className="small mb-1">
          {`${data.status === "INCOMING" ? "Created" : "Updated"} ${moment(
            data.lastUpdate
          ).fromNow()}`}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};
export default RepairCard;
