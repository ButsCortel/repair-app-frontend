import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, handleClose, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Delete Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this request?</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleDelete}>
          Confirm
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
