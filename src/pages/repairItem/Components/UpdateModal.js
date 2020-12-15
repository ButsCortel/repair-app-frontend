import React from "react";
import { Spinner, Modal, Form, Button } from "react-bootstrap";

const UpdateModal = ({
  show,
  handleClose,
  handleSubmit,
  handleChange,
  user,
  repair,
  options,
  state,
}) => {
  return (
    <Modal centered show={show} onHide={handleClose} backdop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="text-left" controlId="status">
            <Form.Control
              name="status"
              value={state.status}
              className="d-inline-block w-auto"
              as="select"
              onChange={handleChange}
              required
              disabled={
                user._id !== repair.customer._id && user.type === "USER"
              }
            >
              <option disabled value="" default>
                New Status:
              </option>
              {options(repair.customer._id, repair.status)}
            </Form.Control>
          </Form.Group>
          <Form.Group className="" controlId="note">
            <Form.Control
              placeholder="Note:"
              as="textarea"
              name="note"
              value={state.note}
              rows={3}
              onChange={handleChange}
              disabled={!state.status || state.loading}
              required
            />
            <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
              {state.hasError ? state.errorMessage : ""}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-end mt-1">
          {state.loading ? <Spinner animation="border" /> : ""}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!state.status || !state.note || state.loading}
          >
            Submit
          </Button>
          <Button className="ml-1" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(UpdateModal);
