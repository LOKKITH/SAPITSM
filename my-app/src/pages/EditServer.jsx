import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Navbar from "../components/Navbar";
import { editServerData, getSingleServer } from "../services/Apis";
import { useParams, useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useContext } from 'react';
import Form from "react-bootstrap/Form";

const StyledTabs = styled(Tabs)({
  marginBottom: "16px",
});

const StyledTab = styled(Tab)({
  minWidth: "120px",
});

const EditServer = () => {
  const { id } = useParams();
  const history = useHistory();
  console.log("is p", id);

  const [serverData, setServerData] = useState({
    serverList: "",
  });
  const { serverList } = serverData;

  const [tabValue, setTabValue] = useState(0);
  const [table2Data, setTable2Data] = useState([]);
  const [showServer, setShowServer] = useState(true);
  const handleShowServer = () => setShowServer(true);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseServer = () => {
    setShowServer(false);
    setServerData({
      ...serverData,
      serverList: "",
    });
    history.push("/configure");
  };

  const handleServerInputChange = (e) => {
    const { name, value } = e.target;
    setServerData({
      ...serverData,
      [name]: value,
    });
  };

 
  // const fetchServerTableData = async () => {
  //   try {
  //     const res = await getSingleServer(id);
  //     console.log("res", res);
  //     setServerData(res.data);
  //   } catch (error) {
  //     console.error("Error fetching table data:", error);
  //   }
  // };
  const handleEditServer = async (e) => {
    // e.preventDefault();
    const data = new FormData();
    data.append("serverList", serverList);

    const response = await editServerData(id, data);
    console.log("response update", response);
    if (response.status === 200) {
      alert("Server Updated successfully!");
      //fetchServerTableData();
      history.push("/configure");
    }
  };

  useEffect(() => {
    //fetchServerTableData();
  }, [id,serverData]);
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
          <StyledTab label="Servers" />
        </StyledTabs>

        <>
        
          <Modal show={showServer} onHide={handleCloseServer}>
              <Modal.Header closeButton>
                {/* <Modal.Title>Server...</Modal.Title> */}
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
                <Button variant="danger" onClick={handleCloseServer}>
                  Close
                </Button>
                <Button
                  type="button"
                  variant="warning"
                  onClick={handleEditServer}
                >
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
        </>
      </Box>
    </>
  );
};

export default EditServer;