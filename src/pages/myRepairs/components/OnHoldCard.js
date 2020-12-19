import React from "react";
import { Card } from "react-bootstrap";

const OnHoldCard = ({ request }) => {
  return (
    <Card border="warning">
      <Card.Body>
        <Card.Title>{request.device}</Card.Title>
        <Card.Text>{request.issue}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default React.memo(OnHoldCard);
