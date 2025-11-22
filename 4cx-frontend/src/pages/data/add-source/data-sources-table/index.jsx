import React, { useEffect, useState, Fragment } from "react";
import {
  Box,
  Chip,
  Grow,
  Paper,
  Table,
  Select,
  Checkbox,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  Pagination,
  IconButton,
  FormControl,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import fetchData from "services/api";
import EditModal from "../edit-modal";
import { toast } from "react-toastify";
import SoftBox from "components/soft-box";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "components/Dialog";
import { useAuth } from "@clerk/clerk-react";
import SoftInput from "components/soft-input";
import { useNavigate } from "react-router-dom";
import DataTypeDropdown from "./data-type-tabs";
import EditIcon from "@mui/icons-material/Edit";
import SoftButton from "components/soft-button";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SoftTypography from "components/soft-typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SourceTypeTabs from "./source-type-tabs/source-type-tabs";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { updateSourceType } from "store/features/dataSourceSlice";
import { setDataSourceData } from "store/features/dataSourceSlice";

export default function DataTable() {
  const sourceTypeUrl = useSelector((state) => state?.dataSource?.sourceType);
  const { userId, orgId } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState({});
  const [openRows, setOpenRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState("file");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [sourceType, setSourceType] = useState(sourceTypeUrl);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const dispatch = useDispatch();

  const handleEntriesPerPageChange = (event) => {
    const newValue = event.target.value;
    setEntriesPerPage(newValue);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = Math.max((currentPage - 1) * entriesPerPage + 1, 1);
  const endIndex = Math.min(startIndex + entriesPerPage - 1, totalDataCount);
  const itemsPerPage = 20;

  const getTableData = async () => {
    const skip = Math.max((currentPage - 1) * entriesPerPage, 0);
    try {
      setLoading(true);
      // Use "plugin" as the default value for data_type if it's not specified
      const requestDataType = dataType;
      const { data, dataCount } = await fetchData("data-sources", "POST", {
        userId,
        limit: entriesPerPage,
        page: currentPage,
        skip,
        data_type: sourceType != "generic" && sourceType != "crm" ? requestDataType : "",
        source_type: sourceType,
        projectId,
      });

      setTotalDataCount(data?.dataCount);

      // Filter data based on sourceType and handle "plugin" as the default data type
      const filteredData = data.filter((item) => {
        if (requestDataType === "folder") {
          return item.source_type === sourceType;
        }
        
        if (item?.source_type === sourceType) {
          return item;
        }
        return item.data_type === requestDataType && item.source_type === sourceType;
      });

      setRows(filteredData);
      setTotalDataCount(dataCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const handleFolderPage = (folderId, event, newPage) => {
    setPage((prev) => ({ ...prev, [folderId]: newPage }));
  };

  useEffect(() => {
    if (projectId) {
      getTableData();
    }
  }, [currentPage, entriesPerPage, dataType, sourceType, projectId]);

  const handleDialogOpen = (row) => {
    setDialogOpen(true);
    setRowToDelete(row);
  };

  const handleDialogClose = () => setDialogOpen(false);

  const handleDeleteRow = async (rowToDelete, dataId = null) => {
    if (!rowToDelete) return;
    try {
      let payload;
      if (dataId) {
        payload = { dataSourceId: dataId, status: true, projectId, organizationId: orgId };
      } else {
        payload = {
          dataSourceId: rowToDelete._id,
          status: true,
          projectId,
          organizationId: orgId,
        };
      }

      await fetchData(`data-sources`, "DELETE", payload, userId);

      if (dataId) {
        const updatedFileNames = rowToDelete.file_name.filter(
          (_, index) => rowToDelete.dataId[index] !== dataId
        );
        const updatedDataId = rowToDelete.dataId.filter((value)=>{
          if(value!== dataId){
            return value
          }
        })
        const updatedRows = rows.map((item) =>
          item._id === rowToDelete._id ? { ...item, file_name: updatedFileNames, dataId:updatedDataId } : item
        );
        setRows(updatedRows);
      } else {
        const updatedRows = rows.filter((item) => item._id !== rowToDelete._id);
        setRows(updatedRows);
        setTotalDataCount(totalDataCount - 1);
        const newTotalPages = Math.ceil((totalDataCount - 1) / entriesPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      }
      toast.success("File Deleted Successfully");
      handleDialogClose();
    } catch (error) {
      console.error("Error deleting row:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleChangeDataType = (newDataType) => {
    setDataType(newDataType);
    setCurrentPage(1);
  };

  const handleChangeSourceType = (newSourceType) => {
    dispatch(updateSourceType(newSourceType))
    setSourceType(newSourceType);
  };

  const toggleRow = (index) => {
    if (openRows.includes(index)) {
      setOpenRows([]);
    } else {
      setOpenRows([index]);
    }
  };

  const handleEditRow = (row) => {
    setSelectedRowData(row);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedRowData("");
  };

  const handleRowClick = (row, sourceType, index) => {
    if (sourceType === "generic" || sourceType === "crm") {
      dispatch(setDataSourceData(row))
      navigate(`/data/add?sourceType=${row?.source_type}&service=${row?.service}`);
    } else {
      toggleRow(index);
    }
  };

  const renderTableRows = (
    rows,
    dataType,
    openRows,
    toggleRow,
    handleDialogOpen,
    handleEditRow,
    sourceType
  ) => {
    return rows.map((row, index) => (
      <Fragment key={index}>
        <TableRow
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          onClick={() => handleRowClick(row, sourceType, index)}
          style={{ cursor: "pointer" }}
        >
          <TableCell padding="checkbox">
            <Checkbox />
          </TableCell>
          <TableCell
            sx={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}
            component="th"
            scope="row"
          >
            {dataType === "file"
              ? row?.file_name
              : dataType === "plugin"
              ? row?.data_config_name
              : dataType === "folder"
              ? row?.folder_name
              : null}
            {sourceType === "generic" || sourceType === "crm" ? row.data_config_name : ""}
          </TableCell>
          {(sourceType === "generic" || sourceType === "crm") && (
            <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
              {row?.service}
            </TableCell>
          )}
          <TableCell align="right" sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
            {row?.source_type}
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
            {row?.is_active ? (
              <Chip size="small" variant="soft" label="On" color="success" />
            ) : (
              <Chip size="small" variant="soft" label="No Connection" color="error" />
            )}
          </TableCell>
          {sourceType != "crm" && sourceType != "generic" && (
            <TableCell align="left" sx={{ display: "flex", gap: "1px", justifyContent: "end" }}>
              <IconButton
                sx={{ fontSize: "15px" }}
                color="secondary"
                onClick={() => handleEditRow(row)}
              >
                <EditIcon />
              </IconButton>
              {dataType === "file" && (
                <IconButton sx={{ fontSize: "15px" }} color="secondary">
                  <VisibilityIcon />
                </IconButton>
              )}
              <IconButton
                sx={{ fontSize: "15px" }}
                color="secondary"
                onClick={() => handleDialogOpen(row)}
              >
                {dataType === "file" && <DeleteIcon />}
              </IconButton>
            </TableCell>
          )}
        </TableRow>
        {dataType === "folder" &&
          openRows.includes(index) &&
          renderFolderRows(row, index, itemsPerPage, page, handleFolderPage)}
      </Fragment>
    ));
  };

  const renderFolderRows = (row, index, itemsPerPage, page, handleFolderPage) => {
    const folderPage = page[row._id] || 0;
    const folderStartIndex = folderPage * itemsPerPage;
    const folderEndIndex = folderStartIndex + itemsPerPage;

    return (
      <>
        {Array.isArray(row?.file_name) &&
          row?.file_name.slice(folderStartIndex, folderEndIndex).map((fileName, idx) => (
            <Grow in={openRows.includes(index)} timeout={500} key={`sub-${index}-${idx}`}>
              <TableRow sx={{ backgroundColor: "#f9f9f9", width: "100%" }}>
                <TableCell padding="checkbox"></TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "0px",
                    width: "100%",
                    fontSize: "13px",
                    fontWeight: "500",
                    textAlign: "start",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "5px", alignItems: "center", width: "100%" }}>
                    <span style={{ color: "#8C8C8C", fontSize: "11px" }}>+</span>
                    <Box
                      sx={{
                        flexGrow: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px",
                      }}
                    >
                      {fileName}
                    </Box>
                  </Box>
                  <IconButton
                    sx={{ fontSize: "15px" }}
                    color="secondary"
                    // onClick={() => handleDialogOpen(row)}
                    onClick={() => handleDeleteRow(row, row.dataId[folderStartIndex + idx])}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </Grow>
          ))}
        {Array.isArray(row?.file_name) && row.file_name.length > itemsPerPage && (
          <TableRow>
            <TableCell colSpan={2}>
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={row.file_name.length}
                rowsPerPage={itemsPerPage}
                page={folderPage}
                onPageChange={(event, newPage) => handleFolderPage(row._id, event, newPage)}
                sx={{
                  "& .MuiTablePagination-displayedRows": {
                    fontSize: "14px",
                    color: "#1e293b",
                    fontWeight: "500",
                  },
                }}
              />
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <SoftBox pt={2} px={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SoftTypography sx={{ fontWeight: "bold", mr: 2 }}>Data Sources</SoftTypography>
        <SoftButton variant="gradient" color="dark" onClick={() => navigate("/data/add")}>
          Create
        </SoftButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl variant="outlined" sx={{ mr: 2 }}>
            <Select
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
          <SoftTypography sx={{ fontSize: "12px", color: "gray", fontWeight: "bold" }}>
            entries per page
          </SoftTypography>
        </Box>
        <SoftBox pt={0} pr={1}>
          <SoftInput
            placeholder="Search here..."
            icon={{ component: "search", direction: "left" }}
          />
        </SoftBox>
      </Box>
      <Box sx={{ display: "flex", gap: "30px", alignItems: "center", width: "100%" }}>
        <Box sx={{ width: "80%" }}>
          <SourceTypeTabs
            dataType={dataType}
            sourceType={sourceType}
            onChange={handleChangeSourceType}
          />
        </Box>
        <Box sx={{ width: "40%" }}>
          {sourceType != "crm" && sourceType != "generic" && (
            <DataTypeDropdown dataType={dataType} onChange={handleChangeDataType} />
          )}
        </Box>
      </Box>
      {loading ? (
        <Box
          sx={{ display: "flex", height: "20vh", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ padding: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                  Name
                </TableCell>
                {(sourceType === "generic" || sourceType === "crm") && (
                  <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                    Service
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                >
                  <SwapVertIcon /> <span>Type</span>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                >
                  <span>Status</span> <SwapVertIcon />
                </TableCell>
                {sourceType != "crm" && sourceType != "generic" && (
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}
                  >
                    <span>Action</span> <SwapVertIcon />
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
            <TableBody>
              {rows.length > 0 ? (
                renderTableRows(
                  rows,
                  dataType,
                  openRows,
                  toggleRow,
                  handleDialogOpen,
                  handleEditRow,
                  sourceType
                )
              ) : (
                <TableRow>
                  <TableCell
                    sx={{ fontSize: "15px", fontWeight: "500" }}
                    colSpan={5}
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
              Showing {Math.min(startIndex, totalDataCount)} to {endIndex} of {totalDataCount}{" "}
              entries
            </SoftTypography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </Box>
        </TableContainer>
      )}
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Confirm Deletion"
        contentText={`This action will delete ${
          dataType === "file" ? rowToDelete?.file_name : rowToDelete?._id
        }. Do you wish to proceed?`}
        agreeText="Confirm"
        disagreeText="Cancel"
        onAgree={() =>
          handleDeleteRow(rowToDelete, rowToDelete.dataId ? rowToDelete.dataId[0] : null)
        }
      />
      <EditModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        rowData={selectedRowData}
        saveButton="Save"
        setRows={setRows}
        handleSuccess={(fileName) => {
          setRows((rows) =>
            rows.map((row) =>
              row._id === selectedRowData._id ? { ...row, file_name: fileName } : row
            )
          );
          toast.success("File edited successfully");
        }}
      />
    </SoftBox>
  );
}
