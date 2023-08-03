import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Navbar from "../components/Navbar";
import {
  addControlData,
  addServerData,
  controlDelete,
  deleteMultipleControl,
  getControlData,
  getServerData,
  serverDelete,
} from "../services/Apis";
import Select from "react-select";
import TableControl from "../components/TableControl";
import TableServer from "../components/TableServer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {useParams, useHistory } from "react-router-dom";

const StyledTabs = styled(Tabs)({
  marginBottom: "16px",
});

const StyledTab = styled(Tab)({
  minWidth: "120px",
});

const StyledTableCell = styled(TableCell)({
  border: "1px solid #ddd",
  padding: "8px",
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
});

const Config = () => {
  //const { id } = useParams();
  const [controlData, setControlData] = useState({
    EventID: "",
    EMAIL: "",
    RISK_ID: "",
    RISK_DESC: "",
    Control_Owner: "",
    Control_Desc: "",
  });

  const { EventID, RISK_DESC, RISK_ID, EMAIL, Control_Desc, Control_Owner } =
    controlData;
  const [serverData, setServerData] = useState({
    serverList: "",
    UID: new Date().getTime().toString(),
  });

  const [tabValue, setTabValue] = useState(0);
  const [table1Data, setTable1Data] = useState([]);
  const [table2Data, setTable2Data] = useState([]);
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedServer, setSelectedServer] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const history = useHistory();

  console.log("sever", selectedServer);

  const handleCloseControl = () => {
    setShowControl(false);
    setControlData({
      ...controlData,
      EventID: "",
      EMAIL: "",
      RISK_ID: "",
      RISK_DESC: "",
      Control_Desc: "",
      Control_Owner: "",
    });
  };

  const handleCloseServer = () => {
    setShowServer(false);
    setServerData({
      ...serverData,
      serverList: "",
    });
  };
  const [showControl, setShowControl] = useState(false);
  const handleShowControl = () => setShowControl(true);
  const [showServer, setShowServer] = useState(false);
  const handleShowServer = () => setShowServer(true);

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

  const handleServerInputChange = (e) => {
    const { name, value } = e.target;
    setServerData({
      ...serverData,
      [name]: value,
    });
  };

  const handleControlSubmit = async (e) => {
    // e.preventDefault();
    // alert("hello check submit control");
    const { EventID, EMAIL, RISK_DESC, RISK_ID, Control_Desc, Control_Owner } =
      controlData;
    const data = new FormData();

    data.append("EventID", EventID);
    data.append("EMAIL", EMAIL);
    data.append("RISK_ID", RISK_ID);
    data.append("RISK_DESC", RISK_DESC);
    data.append("CATEGORY", category);
    data.append("SEVERITY", severity);
    data.append("CONTROL_DESC", Control_Desc);
    data.append("CONTROL_OWNER", Control_Owner);
    data.append("Unique_id", new Date().getTime().toString());

    const response = await addControlData(data);
    // console.log("res", response);
    if (response.status === 200) {
      setControlData({
        ...controlData,
        EventID: "",
        EMAIL: "",
        RISK_ID: "",
        RISK_DESC: "",
        Control_Desc: "",
        Control_Owner: "",
      });

      alert("New Control added successfully!");
      fetchTableData();
    }
  };
  const handleServerSubmit = async (e) => {
    // e.preventDefault();
    const { serverList, UID } = serverData;
    const data = new FormData();
    data.append("serverList", serverList);
    data.append("UID", UID);

    const response = await addServerData(data);

    if (response.status === 200) {
      setServerData({
        ...serverData,
        serverList: "",
      });

      alert("New Server added successfully!");
      fetchServerTableData();
    }
  };

  const handleCheckboxChange = (event, itemId) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== itemId));
    }
  };
  const handleCheckboxChangeServer = (event, itemId) => {
    if (event.target.checked) {
      setSelectedServer([...selectedServer, itemId]);
    } else {
      setSelectedServer(selectedServer.filter((i) => i !== itemId));
    }
  };

  const handleDeleteControl = async () => {
    console.log("set", selectedItems);

    if (!selectedItems.length) {
      alert("Please select a row to Delete.");
    } else if (selectedItems.length > 1) {
      alert("Please Only One Row for Delete");
    } else {
      try {
        // await axios.delete("http://localhost:5050/Controls", {
        //   data: { id: selectedItems },
        // });

        // setTable1Data(
        //   table1Data.filter((item) => !selectedItems.includes(item.id))
        // );
        // fetchTableData();
        // setSelectedItems([]);
        const response = await controlDelete(selectedItems[0]);
        if (response.status === 200) {
          alert("Control Deleted");
          fetchTableData();
        } else {
          alert("error");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleDeleteServer = async () => {
    console.log("set", selectedServer);

    if (!selectedServer.length) {
      alert("Please select a row to Delete.");
    } else {
      try {
        // await axios.delete("http://localhost:5050/Scheduler", {
        //   data: { id: selectedServer },
        // });

        // setTable2Data(
        //   table2Data.filter((item) => !selectedItems.includes(item.id))
        // );
        // fetchServerTableData();
        // setSelectedServer([]);
        const response = await serverDelete(selectedServer[0]);
        if (response.status === 200) {
          
          alert("Server Deleted");
          fetchServerTableData();
          setSelectedServer([]);
        } else {
          alert("error");}
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const fetchTableData = async () => {
    try {
      const res = await getControlData();
      setTable1Data(res.data.reverse());
      //selectedItems = [];
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const fetchServerTableData = async () => {
    try {
      const res = await getServerData();
      setTable2Data(res.data.reverse());
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // const deleteControl = async (id) => {
  //   const response = await controlDelete(id);
  //   if (response.status === 200) {
  //     fetchTableData();
  //     alert("Control Deleted");
  //   } else {
  //     alert("error");
  //   }
  // };
  // const deleteServer = async (id) => {
  //   const response = await serverDelete(id);
  //   if (response.status === 200) {
  //     fetchServerTableData();
  //     alert("Control Delete");
  //   } else {
  //     alert("error");
  //   }
  // };

  const handleEditControl = () => {
    if (!selectedItems.length) {
      alert("Please select a row to edit.");
    } else if (selectedItems.length > 1) {
      alert("Please Only One Row for Update");
    } else {
      setEditMode(true);
      history.push(`/edit/${selectedItems[0]}`);
    }
  };

  const handleEditServer = () => {
    if (!selectedServer.length) {
      alert("Please select a row to edit.");
    } else if (selectedServer.length > 1) {
      alert("Please Only One Row for Update");
    } else {
      setEditMode(true);
      history.push(`/editServer/${selectedServer[0]}`);
    }
  };

  const handleButtonClick = () => {
    handleCloseControl();
    handleControlSubmit();
  };

  const handleButtonClickServer = () => {
    handleCloseServer();
    // handleControlSubmit();
    handleServerSubmit();
  };

  const handleExport = () => {
    alert("Item added to Export Successfully");
  };
  useEffect(() => {
    fetchTableData();
    fetchServerTableData();
  }, []);
  return (
    <>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        margin="80px 0px 0px 0px"
        border="0px solid red"
      >
        <StyledTabs value={tabValue} onChange={handleTabChange} centered>
          <StyledTab label="Controls" />
          <StyledTab label="Servers" />
        </StyledTabs>

        {tabValue === 0 && (
          <>
            <div className="container d-flex justify-content-end mt-4">
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "0px",
                }}
                onClick={handleShowControl}
              >
                Create
              </Button>

              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleEditControl}
              >
                Update
              </Button>
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleDeleteControl}
              >
                Delete
              </Button>
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>

            <Modal show={showControl} onHide={handleCloseControl}>
              <Modal.Header closeButton>
                {/* <Modal.Title>Controls...</Modal.Title> */}
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
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
                      name="Control_Desc"
                      value={Control_Desc}
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
                      name="Control_Owner"
                      value={Control_Owner}
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
                <Button variant="warning" onClick={handleCloseControl}>
                  Close
                </Button>
                <Button
                  type="button"
                  style={{
                    backgroundColor: "#D04A02",
                    border: "white",
                  }}
                  onClick={handleButtonClick}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
            {table1Data.length > 0 ? (
              <TableControl
                table1Data={table1Data}
                //deleteControl={deleteControl}
                selectedItems={selectedItems}
                handleCheckboxChange={handleCheckboxChange}
                setSelectedItems={setSelectedItems}
              />
            ) : (
              //<Typography variant="body1">No controls found.</Typography>
              <Typography variant="body1">Loading.</Typography>
            )}
          </>
        )}

        {tabValue === 1 && (
          <>
            <div className="container d-flex justify-content-end mt-4">
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "0px",
                }}
                onClick={handleShowServer}
              >
                Create
              </Button>

              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleEditServer}
              >
                Update
              </Button>
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleDeleteServer}
              >
                Delete
              </Button>
              <Button
                style={{
                  backgroundColor: "#D04A02",
                  border: "white",
                  marginLeft: "10px",
                }}
                onClick={handleExport}
              >
                Export
              </Button>
            </div>

            <Modal show={showServer} onHide={handleCloseServer}>
              <Modal.Header closeButton>
                {/* <Modal.Title>Controls...</Modal.Title> */}
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Server</Form.Label>
                    <Form.Control
                      type="text"
                      name="serverList"
                      placeholder="Server"
                      value={serverData.serverList}
                      onChange={handleServerInputChange}
                      required
                      autoFocus
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="warning" onClick={handleCloseServer}>
                  Close
                </Button>
                <Button
                  type="button"
                  style={{
                    backgroundColor: "#D04A02",
                    border: "white",
                    marginLeft: "0px",
                  }}
                  onClick={handleButtonClickServer}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>

            {/* <Typography variant="h6" mt={4} mb={2}>
              Servers List
            </Typography> */}
            {table2Data.length > 0 ? (
              <TableServer
                table2Data={table2Data}
                //deleteServer={deleteServer}
                selectedServer={selectedServer}
                handleCheckboxChangeServer={handleCheckboxChangeServer}
              />
            ) : (
              <Typography variant="body1">No servers found.</Typography>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Config;