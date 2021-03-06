import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const CancelModal = ({ show, handleClose, handleCancel, state }) => {
  const [note, setNote] = useState("");
  return (
    <Modal centered show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Cancel Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="cancelNote">
            <Form.Label>Reason for Cancelling:</Form.Label>
            <Form.Control
              onChange={(e) => setNote(e.target.value)}
              name="note"
              value={note}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
            {state.hasError ? state.errorMessage : ""}
          </Form.Text>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {state.loading ? <Spinner animation="border" /> : ""}
        <Button
          disabled={!note}
          variant="primary"
          title={!note ? "Please enter reason first." : ""}
          onClick={() => {
            handleCancel(state.status, note);
            setNote("");
          }}
        >
          Confirm
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
            setNote("");
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(CancelModal);
