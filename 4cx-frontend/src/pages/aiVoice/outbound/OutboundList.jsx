import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import SoftSnackbar from "components/soft-snackbar";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import fetchData from "services/api";
import OutboundJobTable from "./OutboundJobTable";
import SoftButton from "components/soft-button";
import { useNavigate } from "react-router-dom";

export default function OutboundList() {
  // ! ======================= (STATE) =============================
  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [outboundList, setOutboundList] = useState([]);

  // ! ============= (OTHER CONTEXT AND REFS) ========================
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const navigate = useNavigate()

  // ! ================== ( API REQUEST ) ============================
  const fetchOutboundList = async () => {
    try {
      const API_URI = `${process.env.REACT_APP_BASE_URL}/outbound/organizations/${orgId}/projects/${projectId}/users/${userId}/outboundJob`;
      const request = await fetchData(API_URI, "GET", {});
      const { data } = request;
      setOutboundList(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  };

  // ! ================== ( OTHER HANDLE CHANGE ) ====================
  const handleSnackBarClose = () => {
    setSnakbarState({
      status: false,
      message: "",
    });
  };

  useEffect(() => {
    if (projectId && orgId && userId) fetchOutboundList();
  }, [projectId, orgId, userId]);

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
            <Typography variant="h4">Outbound List</Typography>
            <Typography variant="caption">All the listed outbound are in this list</Typography>
          </Box>
          <SoftButton variant="gradient" color="dark" onClick={() => {navigate('/ai-voice/outbound')}} className="w-fit">
            Create Outbound
          </SoftButton>
        </Box>

        {/* ============== DATA-TABLE-COMPONENT ============ */}
        <OutboundJobTable tableData={outboundList}/>
       
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
    </Box>
  );
}
