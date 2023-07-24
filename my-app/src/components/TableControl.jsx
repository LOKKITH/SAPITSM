import React from "react";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { NavLink, Link } from "react-router-dom";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableControl = ({ table1Data, selectedItems, handleCheckboxChange }) => {
  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          border: "0px solid red",
          width: "1370px",
          overflow: "scroll",
          height: "400px",
          margin: "auto",
          marginTop: "30px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Select</StyledTableCell>
              <StyledTableCell>Control ID</StyledTableCell>
              <StyledTableCell align="right">
                Control Description
              </StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell align="right">Risk ID</StyledTableCell>
              <StyledTableCell align="right">Risk Description</StyledTableCell>
              <StyledTableCell align="right">Severity</StyledTableCell>
              <StyledTableCell align="right">Control Owner</StyledTableCell>
              <StyledTableCell align="right">Email Address</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table1Data.map((element, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="e">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(element.id)}
                    onChange={(event) => handleCheckboxChange(event, element.id)}
                  />
                </StyledTableCell>
                <StyledTableCell component="th" scope="element">
                  {element.EventID}
                </StyledTableCell> 
                <StyledTableCell align="right">{element.CONTROL_DESC}</StyledTableCell>        
                <StyledTableCell align="right">{element.CATEGORY}</StyledTableCell>
                <StyledTableCell align="right">{element.RISK_ID}</StyledTableCell>
                <StyledTableCell align="right">{element.RISK_DESC}</StyledTableCell>
                <StyledTableCell align="right">{element.SEVERITY}</StyledTableCell>
                <StyledTableCell align="right">{element.CONTROL_OWNER}</StyledTableCell>
                <StyledTableCell align="right">{element.EMAIL}</StyledTableCell>
                {/* <StyledTableCell
                  size="small"
                  style={{ display: "flex" }}
                ></StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableControl;