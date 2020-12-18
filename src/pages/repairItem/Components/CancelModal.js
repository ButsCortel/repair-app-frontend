import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const CancelModal = ({
  show,
  handleClose,
  handleCancel,
  handleChange,
  state,
}) => {
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
              onChange={handleChange}
              name="note"
              value={state.note}
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
          disabled={!state.note}
          variant="primary"
          title={!state.note ? "Please enter reason first." : ""}
          onClick={handleCancel}
        >
          Confirm
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(CancelModal);
