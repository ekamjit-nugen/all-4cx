import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import WidgetListTable from "./widget-list-table";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import fetchData from "services/api";
import SoftButton from "components/soft-button";
import { useNavigate } from "react-router-dom";
import AlertDialog from "components/Dialog";
import SoftSnackbar from "components/soft-snackbar";
import { useDispatch } from "react-redux";
import { resetAllConfigs } from "store/features/widgetChatbotSlice";

export default function WidgetLists() {
  const [rows, setRows] = useState([]);
  const [selectedWidgetInstance, setSelectedWidgetInstance] = useState(
    {
      id: "",
      widgetName: "",
    } || null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [PublishStatus,setPublishStatus] = useState('')
  const [widgetId,setWidgetId] = useState('')

  const columnsConfig = [
    { field: "widgetName", headerName: "Widget Name", flex: 1 },
    { field: "framework", headerName: "Framework", flex: 1 },
    { field: "dataCreated", headerName: "Data Created", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 2,
    },
  ];

  // ! ========================== (API CALLS) ==============================
  const getInitiialWidgetListRequest = async () => {
    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId}/users/${userId}`;

      const request = await fetchData(API_URI, "GET", {});
      const { data } = request;

      const tableData = data.map((data) => ({
        _id: data._id,
        widgetName: data.widgetName,
        framework: data.framework,
        dataCreated: data.createdAt,
        author: data.user,
        status: data.activeStatus,
      }));

      setRows(tableData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Request failed with status code 404") {
          console.error("Error: ", error.message);
          setRows([]);
        }
      }
    }
  };

  const handleRemoveWidgetRequest = async () => {
    const widgetId = selectedWidgetInstance.id;
    try {
      const baseURL = process.env.REACT_APP_BASE_URL;
      const API_URI = `${baseURL}widget/organizations/${orgId}/projects/${projectId}/users/${userId}/widgets/${widgetId}`;

      const request = await axios.delete(API_URI);

      if (request.status === 204) {
        setSnakbarState({
          type: "success",
          status: true,
          message: "Widget has been removed!",
        });
      }
      await getInitiialWidgetListRequest();
    } catch (error) {
      if (error instanceof AxiosError) {
        const {
          response: { data },
        } = error;
        setSnakbarState({
          type: "error",
          status: true,
          message: data.message,
        });
      }
    } finally {
      setTimeout(() => {
        setSnakbarState({
          status: false,
          message: "",
        });
      }, [1000]);
    }
  };

  // ! ============================( ROW CLICK HANDLERS ) ==================

  const PublishWidget = async (widgetId,status) => {
    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId}/users/${userId}/widgets/${widgetId}`;
      const request = await fetchData(API_URI, "PATCH", {});
        setPublishStatus(status)
        setWidgetId(widgetId)
        setSnakbarState({
          type: "success",
          status: true,
          message: request.message,
        });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setSnakbarState({
          type: "error",
          status: true,
          message: error.message,
        });
      }
    }
  };

  const handleViewWidgetClick = (rowData,column,status) => {
    if(column !== 'status') {
      navigate("/widget/settings", {
        state: {
          widgetId: rowData._id,
          action: "view",
        },
      });
    }else if(status === 'Published' || status === 'Not Published'){
      PublishWidget(rowData?._id,status)
    }
  };

  const handleEditWidgetClick = (event, rowData) => {
    event.stopPropagation();
    navigate("/widget/settings", {
      state: {
        widgetId: rowData._id,
        action: "edit",
      },
    });
  };

  const handleSnackBarClose = () => {
    setSnakbarState({
      status: false,
      message: "",
    });
  };

  const handleDeleteWidgetClick = (rowData) => {
    try {
      setSelectedWidgetInstance({
        id: rowData._id,
        widgetName: rowData.widgetName,
      });
      setDialogOpen(true);
    } catch (error) {
      console.error("Error", error);
    } finally {
      getInitiialWidgetListRequest();
    }
  };

  const handleDialogClose = () => setDialogOpen(false);

  useEffect(() => {
    if (projectId && orgId && userId) getInitiialWidgetListRequest();
  }, [projectId, orgId, userId,PublishStatus, widgetId]);

  return (
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
            <Typography variant="h4">Widgets List</Typography>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={() => {navigate("/widget/settings"), dispatch(resetAllConfigs())}}
            >
              Add Widget
            </SoftButton>
          </Box>
        </Box>

        {/* ============== DATA-TABLE-COMPOENTN ============ */}
        <WidgetListTable
          data={rows}
          columns={columnsConfig}
          isLoading={false}
          updatePayload={() => {}}
          handleViewWidgetClick={handleViewWidgetClick}
          handleEditWidgetClick={handleEditWidgetClick}
          handleDeleteWidgetClick={handleDeleteWidgetClick}
        />
      </Card>
      <SoftSnackbar
        color={snakbarState.type}
        icon="check_circle"
        title={snakbarState.type === "success" ? "Success!" : "Something went wrong!"}
        content={snakbarState.message}
        close={handleSnackBarClose}
        open={snakbarState.status}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={handleSnackBarClose}
      />
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Confirm Deletion"
        contentText={`This action will delete the "${
          selectedWidgetInstance || selectedWidgetInstance.widgetName.length > 0
            ? selectedWidgetInstance.widgetName
            : ""
        }" widget. Do you wish to proceed?`}
        agreeText="Confirm"
        disagreeText="Cancel"
        onAgree={handleRemoveWidgetRequest}
      />
    </Box>
  );
}
