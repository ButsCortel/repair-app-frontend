import React, { useState, useContext } from "react";
import { UserContext } from "../../user-context";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import api from "../../services/api";

import "./index.css";
const LoginPage = ({ history }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
    hasError: false,
    errorMessage: "",
  });
  const { setIsLoggedIn } = useContext(UserContext);
  const handleRegister = () => {
    history.push("/register");
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogin({ ...login, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = login;
      if (!email || !password)
        return setLogin({
          ...login,
          hasError: true,
          errorMessage: "Missing required Information!",
        });
      const response = await api.post("/user/login", { email, password });
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLogin({
        ...login,
        hasError: false,
        errorMessage: "",
      });
      setIsLoggedIn(true);
      history.push("/");
    } catch (error) {
      console.log(error);
      setLogin({
        ...login,
        hasError: true,
        errorMessage: "Username or Password does not match",
      });
    }
  };
  return (
    <Container>
      <Row
        className="justify-content-around align-items-center h-100
      "
      >
        <Col sm={12} md={6} className="m-auto p-5">
          {" "}
          <h1>Repair</h1>
          <p>Professional repair services for you</p>
        </Col>
        <Col sm={12} md={6} className="border rounded p-5 shadow-sm">
          <Form
            onSubmit={handleSubmit}
            className="w-75 m-auto position-relative"
          >
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={login.email}
                placeholder="Enter your Email"
                onChange={handleChange}
                className={`${login.hasError ? "border-danger" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                value={login.password}
                placeholder="Enter your Password"
                onChange={handleChange}
                className={`${login.hasError ? "border-danger" : ""}`}
              />
            </Form.Group>
            <Form.Group className="text-center w-50 mx-auto">
              <Button
                variant="warning"
                type="submit"
                className="btn-block w-30 rounded-pill"
              >
                Sign in
              </Button>
              <Button
                variant="secondary"
                className="btn-block w-30 rounded-pill"
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Form.Group>
            <Form.Text className="error position-absolute text-danger text-center">
              {login.hasError ? login.errorMessage : ""}
            </Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
