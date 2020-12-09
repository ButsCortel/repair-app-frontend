import React from "react";
import { Button, Modal, Container, Row, Col, Form } from "react-bootstrap";

const RequestModal = (props) => {
  return (
    <Modal
      centered
      backdrop="static"
      size="lg"
      animation={false}
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="">
            <Col md={12} lg={6}>
              <Form>
                <Form.Label>Request Info:</Form.Label>
                <Form.Group controlId="device">
                  <Form.Control
                    required
                    name="device"
                    type="text"
                    value={props.state.device}
                    onChange={props.handleChange}
                    placeholder="device"
                  />
                </Form.Group>

                <Form.Group controlId="issue">
                  <Form.Control
                    as="textarea"
                    required
                    name="issue"
                    value={props.state.issue}
                    onChange={props.handleChange}
                    placeholder="issue/description"
                    rows={4}
                  />
                </Form.Group>

                <Form.Group
                  value={props.state.expedite}
                  onChange={props.handleChange}
                  controlId="expedite"
                  className="text-center"
                >
                  <Form.Label>Expedite?: </Form.Label>
                  <input
                    id="Yes"
                    name="expedite"
                    type="radio"
                    className="ml-3"
                    value="Yes"
                    checked={props.state.expedite === "Yes"}
                    onChange={props.handleChange}
                  />
                  <label htmlFor="Yes" className="mr-3">
                    Yes
                  </label>
                  <input
                    id="No"
                    name="expedite"
                    type="radio"
                    className="ml-3"
                    value="No"
                    checked={props.state.expedite === "No"}
                    onChange={props.handleChange}
                  />
                  <label htmlFor="No" className="mr-3">
                    No
                  </label>
                </Form.Group>
                <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
                  {props.state.hasError ? props.state.errorMessage : ""}
                </Form.Text>
              </Form>
            </Col>
            <Col md={12} lg={6}>
              <Form className="h-100">
                <Form.Group controlId="repairImg" className="h-100">
                  <Form.Label>Upload Image:</Form.Label>
                  <Form.File
                    className="bg-light border border-dark rounded mx-auto text-center"
                    name="image"
                    onChange={props.handleChange}
                    style={
                      props.preview
                        ? {
                            backgroundImage: `url(${props.preview})`,
                          }
                        : {}
                    }
                    required
                    accept=".png,.jpg,.jpeg"
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.handleSubmit}>Submit</Button>
        <Button variant="danger" onClick={props.onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(RequestModal);
