import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SoftBox from "components/soft-box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OutboundDataTable({ handleOpen, tableData, handleSelectedRow, handleEdit,handleDelete }) {
  const isLoading = false;

  const ColumnsData = [
    { field: "select", headerName: "Select" },
    { field: "contactName", headerName: "Contact Name" },
    { field: "phoneNumber", headerName: "Phone Number" },
    { field: "category", headerName: "Category" },
    { field: "description", headerName: "Description" },
    { field: "scheduled", headerName: "Scheduled" },
    { field: "callLength", headerName: "Call Length" },
    { field: "status", headerName: "Status" },
    { field: "action", headerName: "Action" },
  ];

  const StatusColor={
    "Not Started" : 'secondary',
    "In Progress" : 'success',
    "Call Ended" : 'info',
    "Call Failed" : 'error'
  }
  return (
    <SoftBox pt={2} px={2}>
      {isLoading ? (
        <Box
          sx={{ display: "flex", height: "20vh", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            padding: 2,
            gap: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          // style={{over}}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              <TableRow>
                {ColumnsData.map((value) => {
                  return (
                    <>
                      <TableCell
                        padding="checkbox"
                        onClick={() => {}}
                        key={`${value?.field}=${value?.headerName}`}
                        sx={{
                          fontWeight: "bold",
                          color: "gray",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        {value.headerName}
                      </TableCell>
                    </>
                  );
                })}
              </TableRow>
            </TableBody>
            <TableBody>
              {tableData && tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      align="left"
                      //   sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                    >
                      <Checkbox
                        onChange={() => {
                          handleSelectedRow(index);
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      {row.contactName}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      {row.phoneNumber}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      {row.category}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px", textOverflow:'ellipsis',overflow:'hidden', whiteSpace:'nowrap', maxWidth:'170px' }}>
                      {row.description}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      {row.scheduled}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      {row.callLength}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      <Chip
                        color={StatusColor[row?.status] || 'secondary'}
                        label={row?.status}
                        variant="filled"
                        sx={{ cursor: "pointer" }}
                        onClick={() => {}}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: "14px" }}>
                      <IconButton sx={{ fontSize: "15px" }} color="secondary" onClick={() => {handleEdit(row)}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ fontSize: "15px" }} color="secondary" onClick={() => {handleDelete(row)}}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "15px", fontWeight: "500" }}
                    colSpan={9}
                    align="center"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ cursor: "pointer" }} onClick={handleOpen}>
                <TableCell padding="checkbox">
                  <AddCircleIcon fontSize="medium" sx={{ color: "#bfbfbf" }} />
                </TableCell>

                {ColumnsData.slice(0, 6).map((value) => {
                  return (
                    <>
                      {value.headerName !== "Select" && (
                        <TableCell
                          padding="checkbox"
                          onClick={() => {}}
                          key={`${value?.field}=${value?.headerName}`}
                          colSpan={value?.headerName === "Contact Name" ? 4 : 0}
                          sx={{
                            color: "gray",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                        >
                          {value.headerName === "Contact Name"
                            ? "Add New Column"
                            : value.headerName}
                        </TableCell>
                      )}
                    </>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </SoftBox>
  );
}
