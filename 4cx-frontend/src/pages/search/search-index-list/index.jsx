import {
  Box,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "services/api";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { updateRetrievalIsLoading } from "store/features/retrievalSlice";
import RefreshButton from "./refresh-button";
import DataTable from "./data-table";
import SoftButton from "components/soft-button";
import CreateButton from "./create-button";

export default function SearchIndexList() {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({
    _id: "",
    name: "",
    dataCreated: "",
    author: "",
    status: "",
  });
  const [totalDataCount, setTotalDataCount] = useState(0);
  const entriesPerPage = 5
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);

  const [rows, setRows] = useState([]);
  const [rowAllData,setRowAllData]= useState([])
  const [rowIndex,setRowIndex] = useState(0)
  const [selectedRow,setSelectedRow] = useState([])
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "dataCreated", headerName: "Data Created", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      renderCell: (params) => {
        console.log(params); // Add this to check what is passed
        return (
          <Chip
            label={params.value}
            onClick={() => handleFilterClick(params.row.fields)}
            variant="filled"
            sx={{ cursor: "pointer" }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 2,
    },
  ];

  useEffect(()=>{
    if(rowAllData){
      setSelectedRow(rowAllData[rowIndex]?.indexesResult)
    }else{
      const data = rowAllData && rowAllData[rowIndex]?.indexer.map((item)=>{return {indexer : item}})
      setSelectedRow(data)

    }
  },[rowIndex,rowAllData])

  const projectId = useSelector((state) => state.projectIdList);
  const dispatch = useDispatch();

  const handleFilterClick = (field) => {
    console.log("Filter clicked for field: ", field);
  };
  const getSaveData = async () => {
    try {
      let response = await fetchData(
        `/search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/searchIndex?skip=${startIndex}`,
        "GET",
        null,
        userId
      );
      setRowAllData(response?.data)
      setTotalDataCount(response?.dataCount)

      if (response?.data && Object.keys(response.data).length > 0) {
        if (response?.data?.length === 1) {
          const formattedTime = formatDate(response?.data?.[0]?.createdAt);
          const data = {
            _id: response?.data?.[0]?._id,
            name: response?.data?.[0]?.data_source_name,
            dataCreated: formattedTime,
            author: response?.data?.[0]?.author,
            status: response?.data?.[0]?.status,
          };
          setRows([data]);
        } else if (response?.data?.length > 1) {
          const data = response?.data.map((data, index) => {
            return {
              _id: data?._id,
              name: data?.data_source_name,
              dataCreated: formatDate(data?.createdAt),
              author: data?.author,
              status: data?.status,
            };
          });
          setRows(data);
        }
      }
      dispatch(updateRetrievalIsLoading(false));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const fetchOption = async () => {
    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "GET"
      );

      if (response?.data?.jsonData?.Select_Data_Source.length > 0) {
        const apiResponse = response?.data?.jsonData?.Select_Data_Source;
        const data = apiResponse.map((data) => {
          return {
            id: data?._id,
            value: data?.file_name,
            label: data?.file_name,
          };
        });
        const isExist = getSelectedItems(
          response?.data?.retrievalJsonData?.retrievalFlowsJson?.select_columns
        );
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      dispatch(updateRetrievalIsLoading(false));
    }
  };

  function getSelectedItems(data) {
    return data?.filter?.((item) => item.isSelected);
  }

  useEffect(() => {
    if (
      projectId.projectId != undefined &&
      projectId.projectId != null &&
      projectId.userId != null
    ) {
      dispatch(updateRetrievalIsLoading(true));
      fetchOption();
      getSaveData();
    }
  }, [projectId, userId,currentPage]);
  const tableData = [
    { id: 1, name: "John Doe", status: "In Progress" },
    { id: 2, name: "Alice Smith", status: "Completed" },
    { id: 3, name: "Bob Johnson", status: "Failed" },
    { id: 4, name: "Emma Brown", status: "In Progress" },
    { id: 5, name: "Michael Lee", status: "Completed" },
    { id: 6, name: "Sophia Wilson", status: "Failed" },
  ];

  const statusColors = {
    "inProgress": "info", // Blue
    'success': "success", // Green
    failed: "error", // Red
  };
  return (
    <>
      <Box
        sx={{
          gap: 4,
          paddingY: 10,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 200px)",
        }}
      >
        <Card
          sx={{
            paddingX: 4,
            paddingY: 5,
            display: "flex",
            overflowY: "auto",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h4">Search Index List</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Dialog open={open} maxWidth="lg" fullWidth>
                <DialogTitle>
                  <Typography variant="h4" fontWeight="bold">
                    {selectedRowData?.name}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <TableContainer component={Paper} sx={{ padding: 2 }}>
                    <Table sx={{ minWidth: 500 }}>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                            Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "gray",
                              fontSize: "14px",
                              textAlign: "end",
                            }}
                          >
                            Items Processed
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "gray",
                              fontSize: "14px",
                              textAlign: "end",
                            }}
                          >
                            Items Failed
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "gray",
                              fontSize: "14px",
                              textAlign: "end",
                            }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                        {selectedRow && selectedRow.length > 0 ? (
                          selectedRow.map((row) => (
                            <>
                            {!Array.isArray(row?.indexer) && <TableRow key={row}>
                              <TableCell sx={{ fontSize: "14px" }}>{row?.indexer}</TableCell>
                              <TableCell sx={{ fontSize: "14px" }}>{row.lastResult?.itemsFailed || 0}</TableCell>
                              <TableCell sx={{ fontSize: "14px" }}>{row.lastResult?.itemsProcessed || 0}</TableCell>
                              <TableCell
                                sx={{ fontSize: "14px", display: "flex", justifyContent: "end" }}
                              >
                                <Chip
                                  color={statusColors[row?.lastResult?.status]? statusColors[row?.lastResult?.status] : statusColors['inProgress']}
                                  label={row?.lastResult?.status ? row?.lastResult?.status : 'inProgress'} 
                                  variant="filled"
                                  style={{ width: "120px" }}
                                />
                              </TableCell>
                            </TableRow>}
                            </>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              align="center"
                              sx={{ fontSize: "15px", fontWeight: "500" }}
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>

                <DialogActions>
                  <SoftButton
                    style={{ width: 100 }}
                    variant="gradient"
                    color="light"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </SoftButton>
                </DialogActions>
              </Dialog>
              <CreateButton />
              <RefreshButton apiCall={() => getSaveData()} />
            </Box>
          </Box>

          {/* ============== DATA-TABLE-COMPOENTN ============ */}
          <DataTable
            data={rows}
            columns={columns}
            isLoading={false}
            updatePayload={() => {}}
            setOpen={setOpen}
            setSelectedRowData={setSelectedRowData}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalDataCount={totalDataCount}
            setRowIndex={setRowIndex}
          />
        </Card>
      </Box>
    </>
  );
}
