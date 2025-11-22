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
  Typography,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import { updateApplyFilter } from "store/features/retrievalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { isEqual } from "lodash";
import { updateRetrievalUnSaveChanges } from "store/features/retrievalSlice";
import SoftButton from "components/soft-button";
import PopupModal from "components/pop-modal";

export default function DataTable({ data, columns, isLoading }) {
  const reduxData = useSelector((state) => state.retrieval);
  const [temp, setTemp] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [activeId, setActiveId] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState(columns[0]?.field || "name");
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();
  const [isSaveModal, setIsSaveModal] = useState({
    state: false,
    data: "",
  });
  useEffect(() => {
    const applyFilterData = reduxData?.retrievalFlowsJson?.apply_filter?.data || [];
    const getFilterValueById = (_id) => {
      const data = applyFilterData.find(({ id }) => id === _id);
      return data?.filter || "";
    };
    const value = reduxData?.retrievalFlowsJson?.select_columns;

    const isExist = getSelectedItems(value?.data);
    if(isExist){

      const rowsData = isExist.flat().map((row) => {
        return {
          ...row,
          filter: getFilterValueById(row.id),
        };
      });
      setRows(rowsData);
      setTotalDataCount(rowsData.length);
    }
  }, [reduxData]);

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
      status: selected?.length > 0 ? true : false,
    };
    dispatch(updateApplyFilter(data));
  };

  const handleAddFilter = (id) => {
    console.log(id, "on click add filter");
    setIsSaveModal((prev) => ({ ...prev, state: true }));
    setActiveId(id);
  };

  function getSelectedItems(data) {
    if(data){
      let dataUpdated = [];
      dataUpdated.push(data.filter((item) => item.isSelected));
      return dataUpdated;
    }
  }

  const handelSaveModal = (data) => {
    if (data.state === false) {
      setIsSaveModal({
        ...data,
        state: false,
      });
    } else if (data.state === true) {
      setIsSaveModal({
        ...data,
        state: false,
      });
      handleReduxDispatch(data);
    }
  };

  const handleReduxDispatch = (val) => {
    const data = rows.map((data) => {
      if (data.id === activeId) {
        return { ...data, filter: val.data };
      } else {
        return data;
      }
    });
    setRows(data);
    const updateReduxData = {
      data: data,
      status: true,
    };
    dispatch(updateApplyFilter(updateReduxData));
    console.log(data, "data added");
  };

  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);
  const displayedRows = rows.slice(startIndex, endIndex);
  // const displayedRows = []
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
                {/* <TableCell padding="checkbox">Select</TableCell> */}
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.field != "filter" ? "left" : "center"}
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
                    {/* <TableCell padding="checkbox">
                      <Checkbox checked={row.isSelected} onChange={() => handleRowSelect(row)} />
                    </TableCell> */}
                    {columns.map((column) => (
                      <TableCell key={column.field} align={column.field != "filter" ? "left" : "center"}>
                        {column.field != "filter" && row[column.field]}
                        {column.field === "filter" && row.filter === "" ? (
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight:600,
                              "&:hover": {
                                textDecoration: "underline",
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => handleAddFilter(row.id)}
                          >
                            Add Filter  
                          </Typography>
                        ) : (
                          column.field === "filter" &&
                          row.filter != "" && (
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight:600,
                                "&:hover": {
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                },
                              }}
                              variant="gradient"
                              color="light"
                              onClick={() => handleAddFilter(row.id)}
                            >
                              {row.filter}
                            </Typography>
                          )
                        )}
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
      )}
      {isSaveModal.state && (
        <PopupModal type="input" isOpen={handelSaveModal} title="Add Filter Option" />
      )}
    </Box>
  );
}
