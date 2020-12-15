import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DeleteModal = ({ show, handleClose, handleDelete, loading }) => {
  return (
    <Modal centered animation show={show} onHide={handleClose} backdop="static">
      <Modal.Header closeButton>
        <Modal.Title>Delete Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this request?</Modal.Body>
      <Modal.Footer>
        {loading ? <Spinner animation="border" /> : ""}
        <Button disabled={loading} variant="primary" onClick={handleDelete}>
          Confirm
        </Button>
        <Button disabled={loading} variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(DeleteModal);
