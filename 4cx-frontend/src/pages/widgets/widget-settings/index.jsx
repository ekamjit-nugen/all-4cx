import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Card, Tab, Tabs, Typography } from "@mui/material";
import SoftBox from "components/soft-box";
import SoftButton from "components/soft-button";
import SoftInput from "components/soft-input";
import SoftTypography from "components/soft-typography";
import WidgetTypeOptions from "./widget-options/widget-type-options";
import SoftSelect from "components/soft-select";
import fetchData from "services/api";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { widgetTypeOptions } from "./constants";
import WidgetInstallConfigurations from "./widget-configurations/install";
import WebUISection from "./widget-configurations/web-ui";
import SoftSnackbar from "components/soft-snackbar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { WebUIThemeProvider } from "./context/theme-context";
import { useDispatch } from "react-redux";
import { setVariant } from "store/features/widgetSettingsSlice";
import chatFlowApi from "../../../pages/flowies/api/chatflows";
import useApi from "pages/flowies/hooks/useApi";
import MobileUISection from "./widget-configurations/mobile-ui";
import TestSection from "./widget-configurations/test";
import axios, { AxiosError } from "axios";

const SearchWidgetSettings = () => {
  const [widgetOptions, setWidgetOptions] = useState("search");
  const [chatbotThemeOptions, setChatbotThemeOptions] = useState("");
  const [optionData, setOptionData] = useState({
    widgetOption: 1,
    widgetSource: "",
    WidgetSouceId: "",
    widgetSourceVersion: null,
  });
  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [flowsVersion, setFlowsVersion] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState("code");
  const [promptDatas, setPromptDatas] = useState([]);
  const [tabValue, setTabValue] = useState("install");
  const [widgetName, setWidgetName] = useState("");
  const [routeState, setRouteState] = useState();
  const [selectedUserType, setSelectedUserType] = useState("login");
  const [activeDesignStep, setActiveDesignStep] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [publishStatus, setPublishStatus] = useState(false);
  const [flowsListData, setFlowsListData] = useState([]);
  const [activeFlow, setActiveFlow] = useState({});
  const [gptModel, setGPTModel] = useState("");
  const [designTestPrompt, setDesignTestPrompt] = useState("");
  const [dummyPrompt, setDummyPrompt] = useState(null);
  const [userApiKey, setUserApiKey] = useState({
    key: "",
    status: false,
  });

  const [currentActiveWidgetId, setCurrentActiveWidgetId] = useState("");
  const [active_id,setActive_id] = useState('')
  const getAllChatflowsApi = useApi(chatFlowApi.getAllChatflowsWidget);
  const [searchpram, setsearchParams] = useSearchParams();
  const chatflowid = searchpram.get("chatflowid");
  const chatbotWidgetSetting = useSelector((state) => state.widgetChatbotSlice);
  const isInitialRender = useRef(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const projectId = useSelector((state) => state.projectIdList);
  const widgetSetting = useSelector((state) => state.widgetSetting);

  const { userId, orgId } = useAuth();
  const [widgetTheme, setWidgetTheme] = useState({
    color: "",
    fontFamily: "",
    fontSize: "",
    designSelected:selectedDesign
  });

  // ! ====================================== (API CALLS) =========================================

  const saveWidgetConfigurationRequest = async () => {
    if (selectedDesign === null && widgetOptions === "search") {
      alert("Please select a design template for widget!");
      return;
    }

    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId?.projectId}/users/${userId}/save`;
      const request = await fetchData(API_URI, "POST", {
        widgetName,
        widgetType: optionData.widgetOption,
        widgetSource: optionData.widgetSource,
        widgetSourceVersion: optionData.widgetSourceVersion,
        framework: selectedFramework,
        designTemplate: selectedDesign,
        flow_id: optionData.WidgetSouceId,
        themeConfiguration : optionData?.widgetOption == 2 ? chatbotWidgetSetting : {...widgetTheme,fontSize:`${widgetTheme?.fontSize}px`, designSelected:selectedDesign}
      });

      const { message, success } = request;

      if (success) {
        setSnakbarState({
          type: "success",
          status: true,
          message: message,
        });

        setTimeout(() => {
          navigate("/widget/widget-lists");
        }, 1000);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    if (projectId?.orgId && projectId?.projectId) {
      getAllChatflowsApi.request(projectId);
    }
  }, [projectId?.orgId, projectId?.projectId]);

  const fetchPromptData = async () => {
    try {
      let response;

      response = await fetchData(
        `/orchestrate/projects/${projectId.projectId}/authors/${userId}/flows`,
        "GET"
      );

      if (response.data && response.data.length > 0) {
        const fetchedData = response?.data;

        setFlowsListData(fetchedData);

        const _data = fetchedData.map((data) => ({
          label: data.flow_name,
          value: data.flow_name,
        }));

        const versionsData = fetchedData.reduce((acc, item) => {
          const flowName = item.flow_name;
          const versionsList = item.versions.map((version) => ({
            label: `version ${version}`,
            value: version,
          }));

          // Add to the accumulator object
          acc[flowName] = versionsList;
          return acc;
        }, {});

        // Set the state with the constructed object
        setFlowsVersion(versionsData);
        // setPromptDatas(_data);
      } else {
        console.error("Expected an array of data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    if (getAllChatflowsApi.data) {
      try {
        const chatflows = getAllChatflowsApi.data?.data;
        const _data = chatflows.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        chatflows.map((data) => {
          if (chatflowid === data.id) {
            setOptionData((prev) => ({
              ...prev,
              widgetSource: data.name,
              WidgetSouceId: data.id,
            }));
          }
        });
        setPromptDatas(_data);
      } catch (e) {
        console.error(e);
      }
    }
  }, [getAllChatflowsApi.data]);

  const handleFetchPreConfigurationRequest = async (widgetId) => {
    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId.projectId}/users/${userId}/widgets/${widgetId}`;

      const request = await fetchData(API_URI, "GET", {});

      const { data } = request;
      setActive_id(data?._id)

      const parsedWidgetType = widgetTypeOptions.at(parseInt(data.widgetType) - 1);
      if(data?.widgetType == 1 ){
        setWidgetTheme(data?.themeConfiguration)
      }
      setWidgetName(data.widgetName);
      setCurrentActiveWidgetId(data?.widgetId || '');
      setOptionData({
        widgetOption: data?.widgetType,
        widgetSource: data.widgetSource,
        widgetSourceVersion: data.widgetSourceVersion,
        WidgetSouceId: data.flow_id,
      });
      setSelectedFramework(data.framework);
      setWidgetOptions(parsedWidgetType);
      setSelectedDesign(data.designTemplate);
      setActiveDesignStep(data.designTemplate);
      setPublishStatus(data.activeStatus === "Not Published" ? false : true);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handlePublishWidgetClick = () => {
    // setPublishStatus(publishStatus ? false : true);
    PublishWidget()
  };

  const modifyWidgetRequest = async () => {

    if (selectedDesign === null && optionData.widgetOption === 1) {
      alert("Please select a design template for the widget!");
      return;
    }

    const widgetId = routeState?.widgetId;

    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId.projectId}/users/${userId}/widgets/${widgetId}`;

      const request = await fetchData(API_URI, "PUT", {
        widgetName,
        widgetType: optionData.widgetOption ? optionData.widgetOption : 1,
        widgetSource: optionData.widgetSource,
        widgetSourceVersion: optionData.widgetSourceVersion,
        framework: selectedFramework,
        designTemplate: selectedDesign,
        // activeStatus: publishStatus ? "Published" : "Not Published",
        themeConfiguration : optionData?.widgetOption == 2 ? chatbotWidgetSetting : {...widgetTheme,fontSize:`${widgetTheme?.fontSize}px`,designSelected:selectedDesign}
      });

      const { message, success } = request;

      if (success) {
        setSnakbarState({
          type: "success",
          status: true,
          message: message,
        });

        setTimeout(() => {
          navigate("/widget/widget-lists");
        }, 1000);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        // if (error.message === "Request failed with status code 403") {
        //   setSnakbarState({
        //     type: "error",
        //     status: true,
        //     message: "Cannot update a published widget!",
        //   });
        // }
      }
    }
  };

  const PublishWidget = async () => {
    const widgetId = routeState?.widgetId;
    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId.projectId}/users/${userId}/widgets/${widgetId}`;
      const request = await fetchData(API_URI, "PATCH", {});
        setTimeout(() => {
          navigate("/widget/widget-lists");
        }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  };

  const generateAIPromptRequest = async (widgetId) => {
    try {
      const API_URI = `/widget/organizations/${orgId}/projects/${projectId.projectId}/users/${userId}/widgets/${widgetId}/prompt`;

      const request = await fetchData(API_URI, "POST", {
        userPrompt: designTestPrompt,
      });

      const { data, message, statusCode } = request;

      setDummyPrompt(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchAPIKeyRequest = async () => {
    try {
      let response = await fetchData(`/widget/organizations/${orgId}/users/${userId}/key`, "GET");
      const { data, message } = response;
      if (data) {
        const { api_key } = data;
        setUserApiKey({
          key: api_key,
          status: true,
        });
      } else {
        throw new Error(message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGeneateAPIKeyRequest = async () => {
    try {
      let response = await fetchData(
        `/widget/organizations/${orgId}/projectId/${projectId.projectId}/users/${userId}/generate-key`,
        "GET"
      );
      const { data, message } = response;
      if (data) {
        const { apiKey } = data;

        setSnakbarState({
          type: "success",
          status: true,
          message: message,
        });

        setUserApiKey({
          key: apiKey,
          status: true,
        });
      } else {
        throw new Error(message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemoveWidgetRequest = async () => {
    const widgetId = routeState?.widgetId;
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

        setTimeout(() => {
          navigate("/widget/widget-lists");
        }, 1000);
      }
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

  // ! ============================================================================================

  const handleDesignInputChange = (event) => setDesignTestPrompt(event.target.value);

  const handleGenerateFlowsDataClick = (event) => {
    const widgetId = location.state?.widgetId;
    if (event.key === "Enter") generateAIPromptRequest(widgetId);
  };

  // Event handlers for updating state on change
  const handleWidgetOptionsChange = (event) => {
    const _value = event.target.value;

    const parseValue = widgetTypeOptions.indexOf(_value) + 1;

    setOptionData((prev) => ({
      ...prev,
      widgetOption: parseValue,
    }));
    setWidgetOptions(_value);
  };

  const handleWidgetNameChange = (event) => {
    setWidgetName(event.target.value);
  };

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
  };

  const handleSlectWidgetSourceChange = (parsedVal) => {
    const { label, value } = parsedVal;
    setOptionData((prev) => ({
      ...prev,
      widgetSource: label,
      WidgetSouceId: value,
    }));
  };

  const handleSlectWidgetSourceVersionChange = (parsedVal) => {
    const { label, value } = parsedVal;
    setOptionData((prev) => ({
      ...prev,
      widgetSourceVersion: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFrameworkSelect = (id) => {
    setSelectedFramework(id);
  };

  const handleSnackBarClose = () => {
    setSnakbarState({
      type: "",
      status: false,
      message: "",
    });
  };

  const handleSelectComponentDesign = () => {
    setSelectedDesign(activeDesignStep);
    const variantData =
      activeDesignStep === 0 ? 1 : activeDesignStep === 1 ? 2 : activeDesignStep === 2 ? 3 : null;
    dispatch(setVariant(variantData));
  };

  useEffect(() => {
    if (userId && orgId && projectId?.projectId) {
      fetchPromptData();
      handleFetchAPIKeyRequest();
      getAllChatflowsApi.request(projectId);
    }
  }, [userId, orgId, projectId?.projectId]);

  useEffect(() => {
    const widgetId = location.state?.widgetId;

    if (widgetId) {
      setRouteState(location.state);
      handleFetchPreConfigurationRequest(widgetId);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  useEffect(() => {
    if (optionData.widgetSource.length > 0) {
      const activeFlowData = flowsListData.filter(
        (flow) => flow.flow_name === optionData.widgetSource
      )[0];
      const gptModelName = activeFlowData?.json_prompt_flow?.nodes?.[2]?.data?.selectedValue?.value;

      setActiveFlow(activeFlowData);
      setGPTModel(gptModelName);
    }
  }, [optionData.widgetSource]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    modifyWidgetRequest();
  }, [publishStatus]);

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
      <SoftTypography fontWeight="medium">Widget Settings</SoftTypography>

      <Box display={"flex"} justifyContent={"space-between"} height={"85%"}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
            borderRightWidth: 1,
            justifyContent: "space-between",
            paddingRight: 4,
          }}
        >
          <SoftBox sx={{ width: "100%" }}>
            <Typography variant="subtitle2">Widget Name</Typography>
            <SoftInput
              placeholder="widget-1234"
              value={widgetName}
              onChange={handleWidgetNameChange}
            />
          </SoftBox>

          <WidgetTypeOptions
            options={widgetTypeOptions}
            label="Widget Type"
            selectedOptions={widgetOptions}
            onChange={handleWidgetOptionsChange}
          />
          <Box></Box>

          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 4 }}>
            <Box>
              <SoftTypography variant="subtitle2">Orchestration Source</SoftTypography>
              <SoftSelect
                name="widgetSource"
                defaultValue={{
                  value: "Select Orchestration Flow",
                  label: "Select Orchestration Flow",
                }}
                value={
                  optionData.widgetSource.length > 0
                    ? { value: optionData.widgetSource, label: optionData.widgetSource }
                    : null
                }
                options={promptDatas}
                onChange={handleSlectWidgetSourceChange}
                fullWidth
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
                InputProps={{
                  style: { fontSize: "16px", padding: "12px" },
                }}
              />
            </Box>
            {/* <Box>
              <SoftTypography variant="subtitle2">Widget Source Version</SoftTypography>
              <SoftSelect
                name="widgetSourceVersion"
                defaultValue={{ value: "Select Source Version", label: "Select Source Version" }}
                value={
                  optionData.widgetSourceVersion
                    ? {
                        value: optionData.widgetSourceVersion,
                        label: `version ${optionData.widgetSourceVersion}`,
                      }
                    : {}
                }
                options={
                  optionData.widgetSource && flowsVersion
                    ? flowsVersion[optionData.widgetSource]
                    : []
                }
                onChange={handleSlectWidgetSourceVersionChange}
                fullWidth
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
                InputProps={{
                  style: { fontSize: "16px", padding: "12px" },
                }}
              />
            </Box> */}
          </Box>

          {routeState?.action === "edit" ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <SoftButton variant="gradient" color="dark" onClick={modifyWidgetRequest}>
                Modify Widget
              </SoftButton>
              {/* <SoftButton
                variant="gradient"
                color={publishStatus ? "success" : "light"}
                onClick={handlePublishWidgetClick}
              >
                {publishStatus ? "Active & Published" : "Publish"}
              </SoftButton> */}
            </Box>
          ) : routeState?.action === "view" ? (
            <></>
          ) : (
            <SoftButton variant="gradient" color="dark" onClick={saveWidgetConfigurationRequest}>
              Create Widget
            </SoftButton>
          )}
        </Box>

        <Box paddingLeft={4} flex={3}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Tabs
              sx={{
                width: "40%",
                display: "flex",
                alignItems: "start",
                marginBottom: 4,
              }}
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Source Type Tabs"
            >
              <Tab sx={{ fontSize: "13px" }} label="Web UI" value="web-ui" />
              <Tab sx={{ fontSize: "13px" }} label="Mobile UI" value="mobile-ui" />
              <Tab sx={{ fontSize: "13px" }} label="Install" value="install" />
              <Tab sx={{ fontSize: "13px" }} label="Test" value="test" />
            </Tabs>

            {routeState?.action === "edit" && (
              <SoftButton variant="gradient" color="error" onClick={handleRemoveWidgetRequest}>
                Delete Widget
              </SoftButton>
            )}
          </Box>

          {tabValue === "install" ? (
            <WidgetInstallConfigurations
              widgetOptions={widgetOptions}
              currentActiveWidgetId={currentActiveWidgetId}
              selectedFramework={selectedFramework}
              handleFrameworkSelect={handleFrameworkSelect}
              selectedUserType={selectedUserType}
              handleUserTypeSelect={handleUserTypeSelect}
              userApiKey={userApiKey}
              handleGeneateAPIKeyRequest={handleGeneateAPIKeyRequest}
              setSnakbarState={setSnakbarState}
              flow_id={optionData.WidgetSouceId}
              publishStatus={publishStatus}
              searchConfig = {widgetTheme}
            />
          ) : tabValue === "web-ui" ? (
            <WebUIThemeProvider>
              <WebUISection
                widgetOptions={widgetOptions}
                chatbotThemeOptions={chatbotThemeOptions}
                activeDesignStep={activeDesignStep}
                selectedDesign={selectedDesign}
                setActiveDesignStep={setActiveDesignStep}
                handleSelectComponentDesign={handleSelectComponentDesign}
                handleDesignInputChange={handleDesignInputChange}
                handleGenerateFlowsDataClick={handleGenerateFlowsDataClick}
                dummyPrompt={dummyPrompt}
                widgetTheme={widgetTheme}
                setWidgetTheme={setWidgetTheme}
              />
            </WebUIThemeProvider>
          ) : tabValue === "mobile-ui" ? (
            <MobileUISection />
          ) : tabValue === "test" ? (
            <TestSection
              widgetOptions={widgetOptions}
              flow_id={optionData.WidgetSouceId}
              activeDesignStep={activeDesignStep}
              active_id={active_id}
            />
          ) : (
            <></>
          )}
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
};

export default SearchWidgetSettings;
