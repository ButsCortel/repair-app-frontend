import React, { useState, useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../user-context";
import { Row, Col, Form, Button } from "react-bootstrap";
import "./index.css";
import api from "../../services/api";

const RequestPage = ({ history }) => {
  const { isLoggedIn } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  // eslint-disable-next-line
  useEffect(() => {
    if (!isLoggedIn) history.push("/login");
  }, []);
  const [state, setState] = useState({
    device: "",
    issue: "",
    image: null,
    expedite: "No",
    hasError: false,
    errorMessage: "",
    success: "",
  });
  const preview = useMemo(() => {
    return state.image ? URL.createObjectURL(state.image) : null;
  }, [state.image]);
  const handleChange = (event) => {
    const { value, name, files } = event.target;
    if (files) return setState({ ...state, [name]: files[0] });
    setState({ ...state, [name]: value });
  };
  const handleRequest = async (event) => {
    console.log(state);
    event.preventDefault();
    const repairData = new FormData();

    try {
      if (state.device && state.issue && state.image) {
        repairData.append("device", state.device);
        repairData.append("customer", user._id);
        repairData.append("issue", state.issue);
        repairData.append("image", state.image);
        repairData.append("expedite", state.expedite);
        await api.post("/requests/create", repairData, {
          headers: { "auth-token": token },
        });
        setState({
          ...state,
          success: true,
          hasError: false,
          errorMessage: "",
        });
        setTimeout(() => history.push("/"), 2000);
      } else {
        setState({
          ...state,
          success: false,
          hasError: true,
          errorMessage: "Missing required information!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    history.push("/");
  };

  return (
    <>
      <Row className="align-items-stretch mx-auto">
        <Col md={12} lg={6} className=" ">
          <h4>Please provide the following information:</h4>
          <Form onSubmit={handleRequest} className="mx-auto">
            <Form.Group controlId="device">
              <Form.Control
                onChange={handleChange}
                value={state.device}
                required
                name="device"
                type="text"
                placeholder="device"
              />
            </Form.Group>

            <Form.Group controlId="issue">
              <Form.Control
                as="textarea"
                required
                onChange={handleChange}
                value={state.issue}
                name="issue"
                placeholder="issue/description"
                rows={4}
              />
            </Form.Group>

            <Form.Group controlId="expedite" className="text-center">
              <Form.Label>Expedite?: </Form.Label>
              <input
                id="Yes"
                name="expedite"
                type="radio"
                className="ml-3"
                checked={state.expedite === "Yes"}
                value="Yes"
                onChange={handleChange}
              />
              <label htmlFor="Yes" className="mr-3">
                Yes
              </label>
              <input
                id="No"
                name="expedite"
                type="radio"
                className="ml-3"
                checked={state.expedite === "No"}
                value="No"
                onChange={handleChange}
              />
              <label htmlFor="No" className="mr-3">
                No
              </label>
            </Form.Group>

            <Form.Group className="text-center w-25 mx-auto">
              <Button
                variant="warning"
                type="submit"
                className="btn-block rounded-pill"
              >
                Create
              </Button>
              <Button
                variant="secondary"
                className="btn-block rounded-pill"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Group>

            <Form.Text className="status font-weight-bold position-absolute text-danger text-center">
              {state.hasError ? state.errorMessage : ""}
            </Form.Text>
            <Form.Text className="status font-weight-bold position-absolute text-success text-center">
              {state.success ? "Success! Redirecting to home..." : ""}
            </Form.Text>
          </Form>
        </Col>
        <Col md={12} lg={6} className="text-center  ">
          <Form className="h-100">
            <Form.Group controlId="repairImg" className="h-100">
              <Form.Label>Upload Image:</Form.Label>
              <Form.File
                className="bg-light border border-dark rounded mx-auto text-center"
                name="image"
                onChange={handleChange}
                style={
                  preview
                    ? {
                        backgroundImage: `url(${preview})`,
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
    </>
  );
};

export default RequestPage;
