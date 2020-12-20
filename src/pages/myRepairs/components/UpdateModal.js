import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const UpdateModal = ({ show, handleClose, handleSubmit, state }) => {
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
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="note">
            <Form.Label>Update request to {state.status}</Form.Label>
            <Form.Control
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note for future reference:"
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
          onClick={() => handleSubmit(state.status, note)}
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

export default React.memo(UpdateModal);