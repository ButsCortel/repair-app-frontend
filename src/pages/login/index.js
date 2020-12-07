import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import { Button, Form, Row, Col } from "react-bootstrap";
import api from "../../services/api";
import "./index.css";

const LoginPage = ({ history }) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(SessionContext);

  useEffect(() => {
    if (isLoggedIn) history.push("/");
    // eslint-disable-next-line
  }, []);
  const [login, setLogin] = useState({
    email: "",
    password: "",
    hasError: false,
    errorMessage: "",
    success: false,
  });
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
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLogin({
        ...login,
        hasError: false,
        errorMessage: "",
        success: true,
      });

      setTimeout(() => {
        setIsLoggedIn(true);
        history.push("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      setLogin({
        ...login,
        hasError: true,
        errorMessage: "Username or Password does not match",
        success: false,
      });
    }
  };
  return (
    <>
      <Row
        className="login justify-content-around align-items-center h-100
      "
      >
        <Col sm={12} md={6} className="m-auto text-center text-md-left">
          {" "}
          <h1>Repair Database</h1>
        </Col>
        <Col sm={12} md={6} className="border rounded p-5 shadow">
          <Form
            onSubmit={handleSubmit}
            className="w-75 m-auto position-relative "
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
                className={`${login.hasError ? "border-danger" : ""} ${
                  login.success ? "border-success" : ""
                }`}
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
                className={`${login.hasError ? "border-danger" : ""} ${
                  login.success ? "border-success" : ""
                }`}
              />
            </Form.Group>
            <Form.Group className="text-center w-50 mx-auto">
              <Button
                variant="warning"
                type="submit"
                className="btn-block rounded-pill"
              >
                Sign in
              </Button>
              <Button
                variant="secondary"
                className="btn-block rounded-pill"
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Form.Group>
            <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
              {login.hasError ? login.errorMessage : ""}
            </Form.Text>
            <Form.Text className="status font-weight-bold position-absolute text-success text-center">
              {login.success ? "Success! Signing in..." : ""}
            </Form.Text>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default LoginPage;
