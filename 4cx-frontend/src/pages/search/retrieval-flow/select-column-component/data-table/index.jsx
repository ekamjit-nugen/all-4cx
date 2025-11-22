import React, { useEffect, useState } from "react";
import {
  Box,
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
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { updateSelectColumn } from "store/features/retrievalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import { updateRetrievalUnSaveChanges } from "store/features/retrievalSlice";

export default function DataTable({
  data,
  columns,
  entriesPerPage,
  handleOpenModal,
  isLoading,
  dropDown,
  setPage,
}) {
  const reduxData = useSelector((state) => state.retrieval);
  const [temp, setTemp] = useState(null);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Use setCurrentPage to update the page
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState(columns[0]?.field || "name");
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const value = reduxData?.retrievalFlowsJson?.select_columns;
    if (value?.data?.length > 0) {
      setRows(value?.data);
      dispatch(updateSelectColumn({ data: value?.data, status: value?.status }));
    } else if (value?.data === null || value?.data < 0 || !value) {
      setRows(data);
      dispatch(updateSelectColumn({ data, status: true }));
      if (!temp) {
        setTemp(value?.data);
      }
    }
  }, [rows, data]);

  useEffect(() => {
    if (setPage) {
      setPage(() => (page) => {
        setCurrentPage(page);
      });
    }
  }, [setPage]);

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
    const updatedRows = rows.map((r) =>
      r.id === row.id ? { ...r, isSelected: !r.isSelected } : r
    );
    setRows(updatedRows);

    const selected = updatedRows.filter((r) => r.isSelected);
    setSelectedRows(selected);
    const data = {
      data: updatedRows,
      status: true,
    };
    dispatch(updateSelectColumn(data));
  };

  // PAGINATION LOGIC
  const totalDataCount = rows.length;
  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);
  const displayedRows = rows?.slice(startIndex, endIndex);

  return (
    <Box pt={2} px={2}>
      {reduxData?.isLoading ? (
        <Box
          sx={{ display: "flex", height: "20vh", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ padding: 2, gap: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align="left"
                    sx={{ fontWeight: "bold", color: "gray", fontSize: "14px", cursor: "pointer" }}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.headerName} <SwapVertIcon />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
            <TableBody>
              {displayedRows.length > 0 ? (
                displayedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={row.isSelected} onChange={() => handleRowSelect(row)} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.field} align="left">
                        {row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}

              {/* Add fields row */}
              <TableRow sx={{ cursor: "pointer" }} onClick={handleOpenModal}>
                <TableCell padding="checkbox">
                  <AddCircleIcon fontSize="medium" sx={{ color: "#bfbfbf" }} />
                </TableCell>

                <TableCell align="left" sx={{ color: "#bfbfbf" }}>
                  Add New Column
                </TableCell>
                <TableCell align="left" sx={{ color: "#bfbfbf" }}>
                  type
                </TableCell>
                <TableCell align="left" sx={{ color: "#bfbfbf" }}>
                  description
                </TableCell>
              </TableRow>
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
              Showing {(startIndex || 0) + 1} to {endIndex} of {totalDataCount} entries
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
    </Box>
  );
}
