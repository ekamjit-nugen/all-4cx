import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";

import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import { dummyPhoneData, phoneListColumnConfig } from "../constants";
import { EditIcon } from "lucide-react";

export default function PhoneNumbersTable({ handleViewPhoneNumberClick, renderData }) {
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);
  const paginatedRows = renderData?.slice(startIndex, endIndex);

  useEffect(() => {
    setTotalDataCount(renderData.length);
  }, [renderData]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
        height: "100%",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        {/* Header Row */}
        <TableBody>
          <TableRow>
            {phoneListColumnConfig.map((column) => (
              <TableCell
                key={column.field}
                align="left"
                sx={{
                  fontWeight: "bold",
                  color: "gray",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                // onClick={() => handleSort(column.field)}
              >
                {column.headerName} <SwapVertIcon />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>

        {/* Data Rows */}
        <TableBody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <TableRow
                onClick={() => handleViewPhoneNumberClick(row)}
                key={row.id}
                sx={{
                  "&:hover": {
                    color: "lightgrey",
                    cursor: "pointer",
                    backgroundColor: "#e4e9ec",
                  },
                }}
              >
                {/* <TableCell padding="checkbox">
                  <Checkbox checked={row.isSelected} />
                </TableCell> */}
                {phoneListColumnConfig.map((column) => (
                  <TableCell key={column.field} align="left" sx={{'&:nth-of-type(4)': { 
                    fontSize: "14px", textOverflow:'ellipsis',overflow:'hidden', whiteSpace:'nowrap', maxWidth:'170px'
                  } }}>
                    {column.field === "status" ? (
                      <Chip
                        color={row.status === "Active" ? "success" : "error"}
                        label={row[column.field]}
                        variant="filled"
                        sx={{ cursor: "pointer" }}
                      />
                    ) : column.field === "action" ? (
                      <Box align="left" sx={{ display: "flex", gap: "1px" }}>
                        <Tooltip title="Edit">
                          <IconButton
                            sx={{ fontSize: "18px" }}
                            color="secondary"
                            onClick={(event) => handleEditWidgetClick(event, row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        {/* <Tooltip title="View">
                          <IconButton
                            sx={{ fontSize: "18px" }}
                            color="secondary"
                            onClick={() => handleViewWidgetClick(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip> */}

                        {/* <Tooltip title="Delete">
                          <IconButton
                            sx={{ fontSize: "18px" }}
                            color="secondary"
                            onClick={() => handleDeleteWidgetClick(row)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    ) : (
                      row[column.field]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={phoneListColumnConfig.length + 1} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination and Footer */}
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
