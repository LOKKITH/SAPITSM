import React, { useState } from 'react';
import { useContext } from 'react';
import { TextField, Button, Container } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from "../components/Navbar";
import {
  test,
  addServerData,
  controlDelete,
  deleteMultipleControl,
  getControlData,
  getServerData,
  serverDelete,
} from "../services/Apis";
const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '350px',
    padding: theme.spacing(3),
    backgroundColor: '#f4f6f8',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FFA500', // Orange color
    color: '#fff',
    '&:hover': {
      backgroundColor: '#FF8C00', // Darker shade of orange on hover
    },
  },
}));

const controls = [
  { label: 'BUS001' },
  { label: 'ITSEC001' },
  { label: 'MC_MM_P033' },
  { label: 'MC_MM_P006' },
  { label: 'MC_SD_2026' },

];

const serverNames = ['Server1', 'Server2', 'Server3', 'Server4'];

const Scheduler = () => {
  const classes = useStyles();
  const [controlsValue, setControlsValue] = useState([]);
  
const [serverValue, setServerValue] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Controls:', controlsValue);
    // console.log('Server:', serverValue);
    // console.log('Date:', date);
    // console.log('Time:', time);
    const requestData = {
      Control: controlsValue,
      Severname: serverValue,
      Start_Time: time
    };
    const response = await test(requestData);
    console.log("res", response);
  };
     
  //   fetch("http:5000/scheduledjob", {
  //     method: "POST", // Set the request method to POST
  //     headers: {
  //       "Content-Type": "application/json", // Set the request content type to JSON
  //     },
  //     body: JSON.stringify(requestData), // Convert the requestData to JSON string and send it as the request body
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("dataRahul", data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <>
    <Navbar/>
      <Container maxWidth="sm" className={classes.container}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              multiple
              options={controls}
              getOptionLabel={(option) => option.label}
              value={controlsValue}
              onChange={(event, values) => {
                setControlsValue(values);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Control"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                />
              )}
            />
            <Autocomplete
              multiple
              options={serverNames}
              value={serverValue}
              onChange={(event, values) => {
                setServerValue(values);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Server"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                />
              )}
            />
            <TextField
              label="Date"
              variant="outlined"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={classes.textField}
            />
            <TextField
              label="Time"
              variant="outlined"
              type="time"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className={classes.textField}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.button}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Scheduler;