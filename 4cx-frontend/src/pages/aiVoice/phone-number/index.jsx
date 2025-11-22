import React, { useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import SoftTypography from "components/soft-typography";
import SoftBox from "components/soft-box";
import SoftInput from "components/soft-input";
import SoftSnackbar from "components/soft-snackbar";
import SoftButton from "components/soft-button";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneNumberDetails from "./phone-number-details";
import fetchData from "services/api";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import SoftSelect from "components/soft-select";
import SoftTextArea from "components/soft-textarea";

export default function PhoneNumber() {
  // ! ======================= (STATE) =============================

  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [routeState, setRouteState] = useState();
  const [phoneNumberData, setPhoneNumberData] = useState({
    phoneNumberName: "",
    phoneNumber: "+1 8745473656",
    region: "GB",
    category: "",
    description: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(false);
  const [errors, setErrors] = useState({});

  // ! ============= (OTHER CONTEXT AND REFS) ========================
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const [aiPromptList, setaiPromptList] = useState([]);

  // ! ================== ( API REQUEST ) ====================
  const handleSaveNumberRequest = async () => {
    try {
      const API_URI = `/phone-number/organizations/${orgId}/projects/${projectId}/users/${userId}/save`;
      const newPhoneNumberPayload = {
        phoneNumberName: phoneNumberData.phoneNumberName,
        phoneNumber: phoneNumberData.phoneNumber,
        region: phoneNumberData.region,
        description: phoneNumberData.description,
        category: phoneNumberData.category,
        status: "Active",
      };

      const request = await fetchData(API_URI, "POST", newPhoneNumberPayload);

      setSnakbarState({
        type: "success",
        status: true,
        message: "Phone Number purchased successfully",
      });

      setSavedStatus(true);
    } catch (error) {
      console.error(error,"error")
    }
  };

  const handleSelectAiPrompt = (aipromptValue) => {
    const { value, label } = aipromptValue;
  };

  const handlePurchaseNumberRequest = async () => {
    setIsLoading(true);
    try {
      const API_URI =
        "https://fourcx-openai.azurewebsites.net/api/PurchasePhoneNumber?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D";

      const request = await fetchData(API_URI, "POST", { region: "GB" });

      setSnakbarState({
        type: "success",
        status: true,
        message: "Phone Number purchased successfully",
      });

      setPurchaseStatus(true);

      setTimeout(() => {
        navigate("/ai-voice/phone-numbers");
      }, 800);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchPhoneNumberDetailsRequest = async (phoneNumberId) => {
    try {
      const API_URI = `/phone-number/organizations/${orgId}/projects/${projectId}/users/${userId}/numbers?phoneNumberId=${phoneNumberId}`;
      const request = await fetchData(API_URI, "GET", {});
      const { data } = request;
      const { phoneNumberName, phoneNumber, region, category, description, status } = data;

      setPhoneNumberData({ phoneNumberName, phoneNumber, region, category, description, status });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  };

  const handleReleaseNumberRequest = async () => {
    setIsLoading(true);
    try {
      const phoneNumberId = routeState.phoneNumberId;
      const API_URI =
        "https://fourcx-openai.azurewebsites.net/api/ReleasePhoneNumber?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D";

      const MODIFY_API_URI = `/phone-number/organizations/${orgId}/projects/${projectId}/users/${userId}/numbers?phoneNumberId=${phoneNumberId}`;

      const request = await fetchData(API_URI, "POST", {
        phone_number: `${phoneNumberData.phoneNumber}`,
      });

      const modifyRequest = await fetchData(MODIFY_API_URI, "PATCH", {});

      setSnakbarState({
        type: "success",
        status: true,
        message: "Phone Number released successfully",
      });

      setTimeout(() => {
        navigate("/ai-voice/phone-numbers");
      }, 800);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ! ================== ( OTHER HANDLE CHANGE ) ====================
  const handleSnackBarClose = () => {
    setSnakbarState({
      status: false,
      message: "",
    });
  };

  const handlePurchasePhoneNumber = () => {
    const { phoneNumberName, phoneNumber, region, category, description } = phoneNumberData;

    const newErrors = {};

    if (!phoneNumberName) newErrors.phoneNumberName = "Phone number name is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!region) newErrors.region = "Region is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!description) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      setSnakbarState({
        type: "error",
        status: true,
        message: "Please full out all fields before purchasing phone number",
      });

      return;
    }

    if (!savedStatus) {
      setSnakbarState({
        type: "error",
        status: true,
        message: "The Number is not saved!",
      });
      return;
    }

    handlePurchaseNumberRequest();
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhoneNumberData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSlectCountryCode = (parsedVal) => {
    const { label, value } = parsedVal;
    setPhoneNumberData((prevState) => ({
      ...prevState,
      region: value,
    }));
  };

  useEffect(() => {
    const phoneNumberId = location.state?.phoneNumberId;
    if (phoneNumberId) {
      setRouteState(location.state);
      handleFetchPhoneNumberDetailsRequest(phoneNumberId);
      // navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  const fetchAiPrompt = async()=>{
    try{
      const response = await fetchData(`/aiVoice/organizations/${orgId}/projects/${projectId}/aiVoice`, "GET", null, userId);
      const options = response?.data?.map((values)=>{return {label:values?.promptName, value : values?.promptName}})
      setaiPromptList(options)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    if(userId && projectId && orgId){
      fetchAiPrompt()
    }
  },[userId,projectId,orgId])

  // ! ======================= ( UI RENDER ) ========================

  return (
    <Card
      sx={{
        gap: 8,
        paddingX: 4,
        paddingTop: 5,
        paddingBottom: 4,
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        height: "calc(100vh - 150px)",
      }}
    >
      <SoftTypography fontWeight="medium">Phone Number Details</SoftTypography>

      <Box display={"flex"} justifyContent={"space-between"} height={"85%"}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
            gap:8,
            borderRightWidth: 1,
            // justifyContent: "space-between",
            paddingRight: 4,
          }}
        >
          <SoftBox sx={{ width: "100%" }}>
            <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
              Phone Number Name
            </Typography>
            <SoftInput
              placeholder="Eg: Fintech PVT LTD"
              name="phoneNumberName" // Add name attribute
              value={phoneNumberData.phoneNumberName}
              onChange={handleChange}
              disabled = {location.state?.action === 'view' ? true : false}
            />
          </SoftBox>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 4,
              borderWidth: 1,
              borderRadius: 2,
              padding: 4,
            }}
          >
            <SoftBox sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                Category Tag
              </Typography>
              <SoftInput
                placeholder="Eg: Finance"
                name="category" // Add name attribute
                value={phoneNumberData.category}
                onChange={handleChange}
              />
            </SoftBox>

            <SoftBox sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                Description
              </Typography>
              <SoftTextArea
                placeholder="Eg: Helpline for Financial Service"
                name="description" // Add name attribute
                value={phoneNumberData.description}
                onChange={handleChange}
              />
            </SoftBox>
          </Box>
          <Box style={{ width: "100%" }}>
            <SoftSelect
              name="phone number"
              defaultValue={{
                value: "Select Ai Prompt",
                label: "Select Ai Prompt",
              }}
              value={""}
              options={aiPromptList}
              onChange={handleSelectAiPrompt}
              fullWidth
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              InputProps={{
                style: { fontSize: "16px", padding: "12px" },
              }}
            />
          </Box>

          <SoftButton variant="gradient" color="dark" disabled = {!phoneNumberData?.phoneNumberName || !phoneNumberData?.category || !phoneNumberData?.description } onClick={handleSaveNumberRequest}>
            Save Phone Number
          </SoftButton>
        </Box>
        <Box paddingLeft={4} flex={3}>
          <PhoneNumberDetails
            routeState={routeState}
            phoneNumberData={phoneNumberData}
            handlePurchasePhoneNumber={handlePurchasePhoneNumber}
            purchaseStatus={purchaseStatus}
            handleReleaseNumberRequest={handleReleaseNumberRequest}
            handleSlectCountryCode={handleSlectCountryCode}
            isLoading={isLoading}
            savedStatus = {savedStatus}
          />
        </Box>
      </Box>
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
    </Card>
  );
}
