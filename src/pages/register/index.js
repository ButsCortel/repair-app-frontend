import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../session-context";
import { Button, Form, Row, Col } from "react-bootstrap";
import api from "../../services/api";

const RegisterPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);

  useEffect(() => {
    if (isLoggedIn) history.push("/");
    // eslint-disable-next-line
  }, []);
  const [register, setRegister] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    type: "",
    hasError: false,
    errorMessage: "",
    success: "",
    link: "",
  });
  const handleChange = (event) => {
    const { value, name } = event.target;
    setRegister({ ...register, [name]: value });
  };
  const handleLogin = () => {
    history.push("/login");
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const { firstName, lastName, password, email, type } = register;
      if (!firstName || !lastName || !password || !email || !type) {
        return setRegister({
          ...register,
          hasError: true,
          errorMessage: "Missing required infromation!",
          success: false,
          link: "",
        });
      }

      const response = await api.post("/user/create", {
        firstName,
        lastName,
        email,
        password,
        type,
      });
      setRegister({
        ...register,
        hasError: false,
        errorMessage: "",
        success: true,
        link: "",
      });
      setTimeout(() => history.push("/login"), 2000);
    } catch (error) {
      console.log(error.response.data.message);
      setRegister({
        ...register,
        hasError: true,
        errorMessage: "Email already exists!",
        link: "Sign up",
        success: false,
      });
    }
  };
  return (
    <>
      <Row className="register justify-content-around align-items-center h-100">
        <Col
          md={12}
          lg={6}
          className="order-2 order-lg-1 border rounded p-5 shadow"
        >
          <Form onSubmit={handleRegister} className="mx-auto">
            <Row>
              <Col>
                <Form.Group inline="true" controlId="firstName">
                  <Form.Control
                    onChange={handleChange}
                    value={register.firstName}
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
                    value={register.lastName}
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
                value={register.email}
                name="email"
                type="email"
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group inline="true" controlId="password">
              <Form.Control
                required
                onChange={handleChange}
                value={register.password}
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group controlId="type" className="text-center">
              <select
                className="form-control border-bottom"
                name="type"
                value={register.type}
                onChange={handleChange}
                required
              >
                <option value="" default>
                  Please select Account type...
                </option>
                <option value="USER">User</option>
                <option value="TECH">Technician</option>
              </select>
            </Form.Group>
            <Form.Group className="text-center w-50 mx-auto">
              <Button
                variant="warning"
                type="submit"
                className="btn-block w-30 rounded-pill"
              >
                Sign up
              </Button>
              <Button
                variant="secondary"
                className="btn-block w-30 rounded-pill"
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Form.Group>

            <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
              {register.hasError ? register.errorMessage : ""}
              {register.link ? <a href="/login"> Sign in instead?</a> : ""}
            </Form.Text>
            <Form.Text className="status font-weight-bold position-absolute text-success text-center">
              {register.success
                ? "Success! Redirecting to Sign in page..."
                : ""}
            </Form.Text>
          </Form>
        </Col>
        <Col md={12} lg={6} className="text-center order-1 order-lg-2">
          <h1>Sign up</h1>
          <p>Please register first to continue.</p>
        </Col>
      </Row>
    </>
  );
};
export default RegisterPage;
