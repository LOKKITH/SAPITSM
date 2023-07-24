import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import { editSingleControlsData, getSingleEditControl } from "../services/Apis";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useContext } from 'react';

const StyledTab = styled(Tab)({
  minWidth: "120px",
});

function EditControl() {
  const { id } = useParams();
  const history = useHistory();
  const [controlData, setControlData] = useState({
    EventID: "",
    EMAIL: "",
    RISK_ID: "",
    RISK_DESC: "",
    CONTROL_OWNER: "",
    CONTROL_DESC: "",
  });

  console.log("Edit control", controlData)
  const { EventID, RISK_DESC, RISK_ID, EMAIL, CONTROL_DESC, CONTROL_OWNER } =
    controlData;


  const [tabValue, setTabValue] = useState(0);
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => {
    setShow(false);
    setControlData({
      ...controlData,
      EventID: "",
      EMAIL: "",
      RISK_ID: "",
      RISK_DESC: "",
      CONTROL_DESC: "",
      CONTROL_OWNER: "",
    });
    history.push("/configure");
  };
  const [show, setShow] = useState(true);
  //   const handleShow = () => setShow(true);
  const optionsCategory = [
    { value: "Business Control", label: "Business Control" },
    { value: "ITSec Control", label: "ITSec Control" },
    { value: "MC_MM_P033", label: "MC_MM_P033" },
    { value: "HH_DD_E077", label: "HH_DD_E077" },
  ];

  const optionsSeverity = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];
  const setCategoryValue = (e) => {
    setCategory(e.value);
  };

  const setSeverityValue = (e) => {
    setSeverity(e.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleControlInputChange = (e) => {
    const { name, value } = e.target;

    setControlData({
      ...controlData,
      [name]: value,
    });
  };
  const fetchTableData = async () => {
    try {
      const res = await getSingleEditControl(id);
      // console.log("res", res);
      setControlData(res.data);
      setCategory(res.data.CATEGORY);
      setSeverity(res.data.SEVERITY);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleEditControl = async () => {
    const { EventID, EMAIL, RISK_DESC, RISK_ID, CONTROL_OWNER, CONTROL_DESC } =
      controlData;
    const data = new FormData();

    data.append("EventID", EventID);
    data.append("EMAIL", EMAIL);
    data.append("RISK_ID", RISK_ID);
    data.append("RISK_DESC", RISK_DESC);
    data.append("CATEGORY", category);
    data.append("SEVERITY", severity);
    data.append("CONTROL_DESC", CONTROL_DESC);
    data.append("CONTROL_OWNER", CONTROL_OWNER);
    data.append("Unique_id", new Date().getTime().toString());

    const response = await editSingleControlsData(id, data);
    console.log("response", response);
    if (response.status === 200) {
      alert("Control Update successfully!");
      fetchTableData();
      history.push("/configure");
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [id]);

  return (
    <>
      <Navbar />
      <Modal show={show} onHide={handleClose}>
        {/* <Modal.Header closeButton>
          <Modal.Title>Controls...</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Control_ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Control ID"
                name="EventID"
                value={EventID}
                onChange={handleControlInputChange}
                autoFocus
              />{" "}
              <Form.Label>Control Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Control Description"
                name="CONTROL_DESC"
                value={CONTROL_DESC}
                onChange={handleControlInputChange}
                autoFocus
              />{" "}
              <Form.Label>Category</Form.Label>
              <Select
                options={optionsCategory}
                onChange={setCategoryValue}
                placeholder="Select Category"
              />
              <Form.Label>Risk ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Risk ID"
                name="RISK_ID"
                value={RISK_ID}
                onChange={handleControlInputChange}
                autoFocus
              />{" "}
              <Form.Label>Risk Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Risk Description"
                name="RISK_DESC"
                value={RISK_DESC}
                onChange={handleControlInputChange}
                autoFocus
              />{" "}
              <Form.Label>Severity</Form.Label>
              <Select
                options={optionsSeverity}
                onChange={setSeverityValue}
                placeholder="Select Severity"
              />
              <Form.Label>Control Owner</Form.Label>
              <Form.Control
                type="text"
                placeholder="Control Owner"
                name="CONTROL_OWNER"
                value={CONTROL_OWNER}
                onChange={handleControlInputChange}
                autoFocus
              />
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                name="EMAIL"
                value={EMAIL}
                onChange={handleControlInputChange}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button type="button" variant="warning" onClick={handleEditControl}>
            Update Control
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditControl;