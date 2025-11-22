/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard PRO React components
import SoftTypography from "components/soft-typography";
import SoftBox from "components/soft-box";

// Soft UI Dashboard PRO React example components
import { Box, Pagination, TableCell } from "@mui/material";
import { useState } from "react";

function SalesTable({ title, tableData, setCurrentPage, currentPage, totalPages, startIndex , endIndex , totalDataCount}) {

  const ColumnsData = [
    { field: "DataSourceIndex", headerName: "Data Source Index" },
    { field: "Updated Date", headerName: "Updated Date" },
    { field: "TotalIndexes", headerName: "Data Sources" },
    // { field: "AiVoicePrompts", headerName: "Ai Voice Prompts" },
    // { field: "OutboundCalls", headerName: "Outbound Calls" },
  ];
  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table>
        <TableHead>
          <SoftBox component="tr" width="max-content" display="block" mb={1.5}>
            <SoftTypography variant="h6" component="td" style={{padding:'10px 0px 0px 10px'}}>
              {title}
            </SoftTypography>
          </SoftBox>
        </TableHead>
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
                      // backgroundColor: "#e4e9ec",
                    },
                  }}
                  onClick={()=>{}}
                  >
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.data_source_name}
                    </TableCell>
                    
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row.updatedAt}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px", }}
                    >
                      {row.totalIndexs}
                    </TableCell>
                    {/* <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row['Ai Voice Prompts']}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontSize: "14px" }}
                    >
                      {row['Outbound Calls']}
                    </TableCell> */}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <SoftTypography variant="body2" color="secondary" sx={{ fontWeight: "bold" }}>
          Showing {startIndex + 1} to {endIndex} of {totalDataCount} entries
        </SoftTypography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          variant="outlined"
          color="primary"
        />
      </Box>
    </TableContainer>
  );
}
export default SalesTable;
