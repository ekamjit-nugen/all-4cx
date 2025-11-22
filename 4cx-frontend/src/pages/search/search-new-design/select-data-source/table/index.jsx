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
  Pagination,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import SoftBox from "components/soft-box";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import { useDispatch } from "react-redux";
import { updateDataSource } from "store/features/searchSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { isEqual } from "lodash";
import { updateUnSaveChanges } from "store/features/searchSlice";

export default function DataTable({ isLoading }) {
  const reduxDataSource = useSelector((state) => state.searchFlow.flowJsonData);
  const [rows, setRows] = useState(reduxDataSource?.Select_Data_Source?.data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState("name");
  const dispatch = useDispatch();
  const [temp, setTemp] = useState([]);
  const location = useLocation();

  // Update rows whenever reduxDataSource changes
  useEffect(() => {
    if (reduxDataSource != undefined) {
      if (reduxDataSource?.Select_Data_Source?.data) {
        if (!temp.length) {
          setTemp(reduxDataSource?.Select_Data_Source?.data);
        }
        setRows(reduxDataSource?.Select_Data_Source?.data);
      }
    }
  }, [reduxDataSource]);


  // Calculate the total number of pages
  const totalDataCount = rows.length;
  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);
  const paginatedRows = rows?.slice(startIndex, endIndex);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sortedRows = [...rows].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setRows(sortedRows);
  };

  const handleRowSelect = (row) => {
    const updatedRow = rows.map((r) =>
      r._id === row._id ? { ...r, isSelected: !r.isSelected } : r
    );
    setRows(updatedRow);
    const isExist = getSelectedItems(updatedRow);

    const data = {
      data: updatedRow,
      status: isExist,
    };
    dispatch(updateDataSource(data));
  };

  function getSelectedItems(data) {
    if(data){

      let dataUpdated = [];
      dataUpdated.push(data.filter((item) => item.isSelected));
      
      if (dataUpdated?.[0]?.length > 0) {
        return true;
      } else {
        return false;
      }
    }
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
        >
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  onClick={() => handleSort("name")}
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px", cursor: "pointer" }}
                >
                  Select
                </TableCell>
                <TableCell
                  onClick={() => handleSort("file_name")}
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px", cursor: "pointer" }}
                >
                  Name <SwapVertIcon />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "gray",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "none",
                  }}
                >
                  Path
                </TableCell>
                <TableCell
                  onClick={() => handleSort("data_type")}
                  align="right"
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px", cursor: "pointer" }}
                >
                  Origin <SwapVertIcon />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={row.isSelected} onChange={() => handleRowSelect(row)} />
                    </TableCell>
                    <TableCell
                      sx={{ color: "#1e293b", fontSize: "14px" }}
                      component="th"
                      scope="row"
                    >
                      {row.file_name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#1e293b",
                        fontSize: "12px",
                        display: "none",
                      }}
                      component="th"
                      scope="row"
                      align="center"
                    >
                      {row.url}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                    >
                      {row.data_type}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                    >
                      {row.status ? (
                        <Chip size="small" variant="soft" label="On" color="success" />
                      ) : (
                        <Chip size="small" variant="soft" label="Not in Use" color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "15px", fontWeight: "500" }}
                    colSpan={4}
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
              padding: "10px 10px",
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
      )}
    </SoftBox>
  );
}
