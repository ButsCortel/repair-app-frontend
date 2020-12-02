import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../user-context";
import { Row, Col, Form, Button } from "react-bootstrap";

const RequestPage = ({ history }) => {
  const { isLoggedIn } = useContext(UserContext);
  useEffect(() => {
    if (!isLoggedIn) history.push("/login");
  }, []);
  const [state, setState] = useState({
    customer: "",
    device: "",
    issue: "",
    image: "",
    hasError: false,
    errorMessage: "",
    success: "",
  });
  const handleChange = (event) => {
    const { value, name } = event.target;
    setState({ ...state, [name]: value });
  };
  const handleRequest = (event) => {
    event.preventDefault();
    console.log(state);
  };
  const handleCancel = () => {
    history.push("/");
  };

  return (
    <>
      <Row
        className="d-flex 
      align-items-stretch border rounded p-5 shadow"
      >
        <Col md={12} lg={6} className="order-2 order-lg-1 ">
          <Form onSubmit={handleRequest} className="mx-auto">
            <Row>
              <Col>
                <Form.Group inline="true" controlId="firstName">
                  <Form.Control
                    onChange={handleChange}
                    value={state.firstName}
                    required
                    name="firstName"
                    type="text"
                    placeholder="Firstname"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group inline="true" controlId="lastName">
                  <Form.Control
                    onChange={handleChange}
                    value={state.lastName}
                    required
                    name="lastName"
                    type="text"
                    placeholder="Lastname"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group inline="true" controlId="email">
              <Form.Control
                required
                onChange={handleChange}
                value={state.email}
                name="email"
                type="email"
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group inline="true" controlId="password">
              <Form.Control
                required
                onChange={handleChange}
                value={state.password}
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group controlId="type" className="text-center">
              <select
                className="form-control border-bottom"
                name="type"
                value={state.type}
                onChange={handleChange}
                required
              >
                <option value="" default aria-readonly>
                  Please select Account type...
                </option>
                <option value="USER">User</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </Form.Group>
            <Form.Group className="text-center w-50 mx-auto">
              <Button
                variant="warning"
                type="submit"
                className="btn-block w-30 rounded-pill"
              >
                Create
              </Button>
              <Button
                variant="secondary"
                className="btn-block w-30 rounded-pill"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Group>

            <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
              {state.hasError ? state.errorMessage : ""}
            </Form.Text>
            <Form.Text className="status font-weight-bold position-absolute text-success text-center">
              {state.success ? "Success! Redirecting to Sign in page..." : ""}
            </Form.Text>
          </Form>
        </Col>
        <Col md={12} lg={6} className="text-center order-1 order-lg-2">
          <h1>Sign up</h1>
          <p>Please state first to continue.</p>
        </Col>
      </Row>
    </>
  );
};

export default RequestPage;
