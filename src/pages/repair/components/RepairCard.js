import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import { SessionContext } from "../../../session-context";
import moment from "moment";
import { useHistory } from "react-router-dom";

const RepairCard = ({ data }) => {
  const history = useHistory();
  const { setRepair } = useContext(SessionContext);
  const statusColor = (status) => {
    switch (status) {
      case "RECEIVED":
        return "secondary";
      case "ONGOING":
        return "warning";
      case "ON HOLD":
        return "danger";
      case "OUTGOING":
        return "info";
      case "COMPLETED":
        return "success";
      default:
        return "primary";
    }
  };
  const handleClick = (repair) => {
    setRepair(repair);
    history.push("/repairs/" + repair.device);
  };
  return (
    <Card
      onClick={() => handleClick(data)}
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
        <Card.Text
          className={`${
            data.expedite ? "text-danger" : "text-secondary"
          } small mb-1`}
        >
          {data.expedite ? "EXPEDITE" : "REGULAR"}
        </Card.Text>
        <Card.Text className={`small mb-1 text-${statusColor(data.status)}`}>
          {data.status}
        </Card.Text>
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
