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
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import { updateApplyFilter } from "store/features/retrievalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fetchData from "services/api";
import { updateRetrievalIsLoading } from "store/features/retrievalSlice";
import { updateFlowJsonData } from "store/features/searchSlice";
import { updateRetrievalJson } from "store/features/retrievalSlice";
import { updateSearchCreateNew } from "store/features/searchSlice";
import { updateRetrievalCreateNew } from "store/features/retrievalSlice";
import { initialSearchReduxData } from "pages/search/const";
import { initialRetrievalReduxData } from "pages/search/const";
import { isEqual } from "lodash";
import { resetSearchJson } from "store/features/searchSlice";
import { resetRetrievalJson } from "store/features/retrievalSlice";
import { updateRetrievalId } from "store/features/retrievalSlice";
import { updateIndexId } from "store/features/projectIdSlice";
import { updateRetrievalDropDownValue } from "store/features/retrievalSlice";
import { updateDataSourceName } from "store/features/searchSlice";
import { IconEye } from "@tabler/icons-react";

export default function DataTable({
  data,
  columns,
  isLoading,
  setOpen,
  setSelectedRowData,
  totalPages,
  startIndex,
  endIndex,
  currentPage,
  setCurrentPage,
  totalDataCount,
  setRowIndex
}) {
  const reduxData = useSelector((state) => state.retrieval);
  const searchReduxData = useSelector((state) => state.searchFlow);
  const [rows, setRows] = useState([]);
  const projectId = useSelector((state) => state.projectIdList);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState(columns[0]?.field || "name");
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    dispatch(resetSearchJson());
    dispatch(resetRetrievalJson());
  }, []);

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
    dispatch(updateApplyFilter(data));
  };

  const handleFilterClick = (val) => {
    console.log("value :", val);
  };

  const isSearchValid = isEqual(initialSearchReduxData, searchReduxData);
  const isRetrievalValid = isEqual(initialRetrievalReduxData, reduxData);

  const handleRowClick = (data, action = false) => {
    if (!action) {
      dispatch(updateSearchCreateNew(true));
      dispatch(updateRetrievalCreateNew(true));
      dispatch(updateRetrievalIsLoading(true));
      handleGetDataById(data?._id);
      dispatch(updateIndexId(data?._id));
    }
  };

  const handleGetDataById = async (id) => {
    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save?indexId=${id}`,
        "GET"
      );

      if (response?.data) {
        dispatch(updateDataSourceName(response?.data?.data_source_name));

        if (response?.data?.jsonData) {
          dispatch(updateFlowJsonData(response?.data?.jsonData));
        } else {
          if (!isSearchValid) {
            dispatch(updateFlowJsonData(initialSearchReduxData));
          }
        }

        if (response?.data?.retrievalJsonData) {
          dispatch(updateRetrievalJson(response?.data?.retrievalJsonData?.retrievalFlowsJson));
          dispatch(
            updateRetrievalDropDownValue(response?.data?.retrievalJsonData?.drop_down_value)
          );
        } else if (response?.data) {
          dispatch(updateRetrievalCreateNew(true));
        } else {
          if (!isRetrievalValid) {
            dispatch(resetRetrievalJson());
          }
        }
      }
      navigate("/aiIndex/general", { state: { fromIndex: true } });
      dispatch(updateRetrievalIsLoading(false));
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const statusColors = {
    "In Progress": "primary", // Blue
    'Success': "success", // Green
    Failed: "error", // Red
    "Partially Completed": "warning",
  };
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
            {/* Header Row */}
            <TableBody>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align="left"
                    sx={{
                      fontWeight: "bold",
                      color: "gray",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.headerName} <SwapVertIcon />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>

            {/* Data Rows */}
            <TableBody>
              {data.length > 0 ? (
                data.map((row,index) => (
                  <TableRow
                    key={row.id}
                    // onClick={() => handleRowClick(row)}
                    sx={{
                      "&:hover": {
                        color: "lightgrey",
                        cursor: "pointer",
                        backgroundColor: "#e4e9ec",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={row.isSelected} onChange={() => handleRowSelect(row)} />
                    </TableCell>
                    {columns.map((column) => (
                      <>
                        {column.field !== "action" && (
                          <TableCell
                            key={column.field}
                            align="left"
                            onClick={() => handleRowClick(row)}
                          >
                            {/* Conditionally render Chip for the 'status' column */}
                            {column.field === "status" ? (
                              <Chip
                                color={statusColors[row[column.field]] || "error"}
                                label={row[column.field]}
                                onClick={() => handleFilterClick(row.field)}
                                variant="filled"
                                sx={{ cursor: "pointer", width: "155px" }}
                              />
                            ) : (
                              row[column.field]
                            )}
                          </TableCell>
                        )}
                        {column.field === "action" && (
                          <TableCell
                            key={column.field}
                            align="left"
                            onClick={() => {
                              setOpen(true);
                              setSelectedRowData(row);
                              setRowIndex(index)
                            }}
                          >
                            <IconEye />
                          </TableCell>
                        )}
                      </>
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
      )}
    </Box>
  );
}
