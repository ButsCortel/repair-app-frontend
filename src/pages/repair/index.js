import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../session-context";
import {
  Row,
  Col,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import RepairCard from "./components/RepairCard";
import { MdSearch } from "react-icons/md";
import api from "../../services/api";
import "./index.css";

const RepairPage = ({ history }) => {
  const { isLoggedIn } = useContext(SessionContext);
  const [repairs, setRepairs] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return history.push("/login");
    getRepairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(
    () => {
      getRepairs();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter]
  );

  const getRepairs = async () => {
    setLoading(true);
    api
      .get(`/requests/all/${filter === "All" ? "" : filter.toUpperCase()}`, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setRepairs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setRepairs(null);
        setLoading(false);
        console.log(error);
      });
  };
  const handleClick = (id) => {
    history.push("/repairs/" + id);
  };
  const handleSelect = (event) => {
    setFilter(event.target.innerText);
  };
  const handleSearch = () => {
    if (repairs) {
      const searched = repairs.filter((repair) => {
        return repair.device.includes(search);
      });
      setSearchRes(searched);
    }
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <Row className="justify-content-between">
        <Col sm={3}>
          <ButtonGroup className="mb-1 mb-sm-0 w-100">
            <DropdownButton
              as={ButtonGroup}
              title={filter}
              variant="outline-primary"
              id="bg-nested-dropdown"
              onSelect={handleSelect}
              className="w-50"
            >
              <Dropdown.Item>All</Dropdown.Item>
              <Dropdown.Item>Incoming</Dropdown.Item>
              <Dropdown.Item>Received</Dropdown.Item>
              <Dropdown.Item>Ongoing</Dropdown.Item>
              <Dropdown.Item>On hold</Dropdown.Item>
              <Dropdown.Item>Outgoing</Dropdown.Item>
              <Dropdown.Item>Completed</Dropdown.Item>
              <Dropdown.Item>Cancelled</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </Col>
        <Col sm={4}>
          <InputGroup className="ml-1">
            <FormControl
              type="text"
              placeholder="search"
              value={search}
              onChange={handleChange}
              aria-label="Input group example"
              aria-describedby="btnGroupAddon2"
              onKeyUp={handleEnter}
            />
            <InputGroup.Append onClick={handleSearch}>
              <InputGroup.Text id="btnGroupAddon2">
                <MdSearch />
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      {!loading && repairs ? (
        <Row className="repair-row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
          {searchRes
            ? searchRes.map((repair) => (
                <Col key={repair._id}>
                  <RepairCard data={repair} handleClick={handleClick} />
                </Col>
              ))
            : repairs.map((repair) => (
                <Col key={repair._id}>
                  <RepairCard data={repair} handleClick={handleClick} />
                </Col>
              ))}
        </Row>
      ) : loading ? (
        <Row>
          <Col>
            <div className="text-center text-muted">
              <p>Loading Queue...</p>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="text-center">
              There are no
              <span className="">
                {" "}
                {filter === "All" ? "" : filter.toLowerCase() + " "}
              </span>
              requests for now.
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default RepairPage;
