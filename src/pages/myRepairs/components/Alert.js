import React from "react";
import { Button, Modal } from "react-bootstrap";

const Alert = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Open Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>Request has been deleted.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(Alert);
