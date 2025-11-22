import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SoftSnackbar from "components/soft-snackbar";
import SoftButton from "components/soft-button";
import PhoneNumbersTable from "./phone-number-table";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import fetchData from "services/api";

export default function PhoneNumbersList() {
  // ! ======================= (STATE) =============================
  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [phoneNumbersData, setPhoneNumbersData] = useState([]);

  // ! ============= (OTHER CONTEXT AND REFS) ========================
  const navigate = useNavigate();
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);

  // ! ================== ( API REQUEST ) ============================
  const handleFetchInitialPhoneNumberRequest = async () => {
    try {
      const API_URI = `/phone-number/organizations/${orgId}/projects/${projectId}/users/${userId}/numbers`;
      const request = await fetchData(API_URI, "GET", {});
      const { data } = request;
      setPhoneNumbersData(data);
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

  const handleViewPhoneNumberClick = (rowData) => {
    navigate("/ai-voice/inbound", {
      state: {
        phoneNumberId: rowData._id,
        action: "view",
      },
    });
  };

  useEffect(() => {
    if (projectId && orgId && userId) handleFetchInitialPhoneNumberRequest();
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
            <Typography variant="h4">Phone Numbers List</Typography>
            <Typography variant="caption">All the listed numbers are in this list</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={() => navigate("/ai-voice/inbound")}
            >
              Purchase Phone Number
            </SoftButton>
          </Box>
        </Box>

        {/* ============== DATA-TABLE-COMPONENT ============ */}
        <PhoneNumbersTable
          renderData={phoneNumbersData}
          handleViewPhoneNumberClick={handleViewPhoneNumberClick}
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
    </Box>
  );
}
