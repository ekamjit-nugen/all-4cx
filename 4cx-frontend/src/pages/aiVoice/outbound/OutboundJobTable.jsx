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
} from "@mui/material";
import SoftBox from "components/soft-box";
import { useNavigate } from "react-router-dom";

export default function OutboundJobTable({ tableData, handleSelectedRow}) {
  const isLoading = false;

  const ColumnsData = [
    { field: "outboundJobName", headerName: "Outbound Job Name" },
    { field: "categoryTag", headerName: "Category Tag" },
    { field: "description", headerName: "Description" },
    { field: "phoneNumber", headerName: "Phone Number" },
  ];
  const navigate = useNavigate()
  const handleViewOutboundClick = (rowData) => {
    navigate("/ai-voice/outbound", {
      state: {
        outboundJobData: rowData,
        action: "view",
      },
    });
  };


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
                tableData.map((row) => (
                  <TableRow key={row.id} sx={{
                    "&:hover": {
                      color: "lightgrey",
                      cursor: "pointer",
                      backgroundColor: "#e4e9ec",
                    },
                  }}
                  onClick={()=>{handleViewOutboundClick(row)}}
                  >
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.outboundJobName}
                    </TableCell>
                    
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.categoryTag}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px", textOverflow:'ellipsis',overflow:'hidden', whiteSpace:'nowrap', maxWidth:'120px' }}
                    >
                      {row.description}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.phoneNumber}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "15px", fontWeight: "500" }}
                    colSpan={8}
                    align="center"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </SoftBox>
  );
}
