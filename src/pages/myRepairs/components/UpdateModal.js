import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const UpdateModal = ({ show, handleClose, handleSubmit, state, status }) => {
  const [note, setNote] = useState("");
  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        handleClose();
        setNote("");
      }}
      backdrop="static"
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="note">
            <Form.Label>Update request to {status}</Form.Label>
            <Form.Control
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note: (optional)"
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
          variant="primary"
          onClick={() => {
            handleSubmit(note);
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

export default UpdateModal;
