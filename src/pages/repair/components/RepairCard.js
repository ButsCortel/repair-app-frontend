import React from "react";
import { Card } from "react-bootstrap";

const RepairCard = ({ data }) => {
  const statusColor = (status) => {
    return;
  };
  return (
    <Card className="my-2 p-1 mx-auto">
      <div
        style={{ backgroundImage: `url(${data.image_url})` }}
        className="card-img-top mx-auto border border-light rounded"
      ></div>
      <Card.Body className="p-2">
        <Card.Title className="small mb-1 font-weight-bold">
          {data.device}
        </Card.Title>
        <Card.Text
          className={`${
            data.expedite ? "text-danger" : "text-info"
          } small mb-1`}
        >
          {data.expedite ? "EXPEDITE" : "REGULAR"}
        </Card.Text>
        <Card.Text className="small mb-1">{data.status}</Card.Text>
        <div className="scroll">
          <Card.Text className="small mb-1">{data.issue}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};
export default RepairCard;
