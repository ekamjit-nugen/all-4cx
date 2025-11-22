import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Card,
  CircularProgress,
  Input,
  Pagination,
  PaginationItem,
  Switch,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { updateEditAiPromptStatus, updateEditAiPromptData } from "store/features/aiPromptSlice";
import fetchData from "services/api";
import PageLoader from "components/page-loader";
import TextEditor from "pages/prompts/prompt-flow/modules/textEdition";
import SoftButton from "components/soft-button";
import useApi from "pages/flowies/hooks/useApi";
import { FlowListTable } from "pages/flowies/ui-component/table/FlowListTable";
import chatflowsApi from "@/api/chatflows";
import { baseURL } from "pages/flowies/store/constant";
import { initialPromptProjectDataAi } from "pages/prompts/prompt-flow/const";
import { initialPromptOrganisationDataAi } from "pages/prompts/prompt-flow/const";
import { updateFlowiseId } from "store/features/aiPromptSlice";

export default function CreateAI() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgId, userId } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = useSelector((state) => state.aiPrompt.isEdit);
  const promptEditData = useSelector((state) => state.aiPrompt.data);
  const [promptData, setPromptData] = useState(promptEditData);
  const reduxVersion = useSelector((state) => state.aiPrompt.version);
  const reduxPromptId = useSelector((state) => state.aiPrompt.promptId);
  const flowiseId = useSelector((state) => state.aiPrompt.flowiseId);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isStateEmpty = Object.values(promptData).every((value) => value === "");
  const handleIntroPrompt = (value) =>
    setPromptData((promptData) => ({ ...promptData, introPrompt: value }));
  const handleBusiLogic = (value) =>
    setPromptData((promptData) => ({ ...promptData, promptText: value }));
  const handlClosurePrompt = (value) =>
    setPromptData((promptData) => ({ ...promptData, closurePrompt: value }));
  const { state } = useLocation();
  const [totalDataCount, setTotalDataCount] = useState(0);

  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(
    promptEditData?.businessLogicType?.toLowerCase() || "prompt"
  );
  const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflowsAi);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [search, setSearch] = useState("");
  const [skipValue, setSkipValue] = useState(0);
  const [currentPage ,setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalDataCount / 5);
  const [flowiseLoading,setFlowiseLoading] = useState(false)

  const handleOnChange = (name, value) => {
    setPromptData({
      ...promptData,
      [name]: value,
    });
  };
  function handlePage(value) {
    setSkipValue((value - 1) * 5);
  }
  const handleCreatePrompt = () => {
    if (!isStateEmpty) {
      let payload = {};
      if (tabValue === "prompt") {
        payload = { ...promptData, businessLogicType: "PROMPT", flowiseId: "" };
      } else {
        payload = {
          ...promptData,
          businessLogicType: "FLOW",
          flowiseId: flowiseId,
          promptText: "",
          flowisePage:currentPage
        };
      }
      setIsLoading(true);
      fetchData(
        `/aiVoice/organizations/${orgId}/projects/${projectId}/aiVoice`,
        "POST",
        payload,
        userId
      )
        .then((response) => {
          if (response) {
            setPromptData(initialPromptProjectDataAi);
            toast.success("New prompt version is created");
            setTimeout(() => {
              navigate("/aiVoice/aiPromptList");
            }, 1000);
          }
        })
        .catch((error) => toast.error(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleUpdatePrompt = () => {
    setIsLoading(true);
    fetchData(
      `/aiVoice/organizations/${orgId}/projects/${projectId}/aiVoice`,
      "POST",
      { ...promptData, isUpdated: true, version: reduxVersion, flowiseId:flowiseId, flowisePage:currentPage },
      userId
    )
      .then((response) => {
        if (response && response.message) {
          dispatch(updateEditAiPromptStatus(false));
          toast.success("New prompt version is created");
          setTimeout(() => {
            navigate("/aiVoice/aiPromptList");
          }, 1000);
        } else {
          toast.error("Update failed");
        }
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error("Unauthorized access can't perform this action");
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (event, value) => {
    setTabValue(value);
  };

  useEffect(() => {
    if (orgId && projectId) {
      if (projectId) {
        getAllChatflowsApi.request(orgId, projectId, skipValue ? skipValue : 0);
      }
    }
  }, [orgId, projectId, skipValue]);

  const filterFlows = (data) => {
    return (
      data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1)
    );
  };
  useEffect(() => {
    if (getAllChatflowsApi?.data) {
      setTimeout(() => {
        setFlowiseLoading(false)
      }, 1000);
      try {
        const chatflows = getAllChatflowsApi?.data?.data;
        setTotalDataCount(getAllChatflowsApi?.data?.total);
        const images = {};
        for (let i = 0; i < chatflows.length; i += 1) {
          const flowDataStr = chatflows[i].flowData;
          const flowData = JSON.parse(flowDataStr);
          const nodes = flowData.nodes || [];
          images[chatflows[i].id] = [];
          for (let j = 0; j < nodes.length; j += 1) {
            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j]?.data?.name}`;
            if (!images[chatflows[i].id].includes(imageSrc)) {
              images[chatflows[i].id].push(imageSrc);
            }
          }
        }
        setImages(images);
      } catch (e) {
        console.error(e);
      }
    }
  }, [getAllChatflowsApi?.data, skipValue]);
  useEffect(() => {
    const handleAuthorName = async () => {
      try {
        const response = await fetchData("tenant/", "POST", { userId });
        setEmail(response?.tenantInfo?.email);
      } catch (error) {
        console.error("Error extracting data:", error);
      }
    };
    if (userId) {
      handleAuthorName();
    }
  }, [userId]);
  useEffect(() => {
    if (state?.name === undefined || null) {
      dispatch(updateEditAiPromptData(initialPromptProjectDataAi));
      dispatch(updateEditAiPromptStatus(false));
      setPromptData(initialPromptProjectDataAi);
    } else if (state?.name === "org") {
      dispatch(updateEditAiPromptData(initialPromptOrganisationDataAi));
      dispatch(updateEditAiPromptStatus(false));
      setPromptData(initialPromptOrganisationDataAi);
    }
  }, [state]);

  const handleCancel = () => {
    dispatch(updateEditAiPromptData(initialPromptProjectDataAi));
    dispatch(updateEditAiPromptStatus(false));
    setPromptData(initialPromptProjectDataAi);
    navigate("/aiVoice/aiPromptList");
  };

  useEffect(() => {
    if (isEdit) {
      setPromptData({
        userId: userId,
        projectId: projectId,
        organizationId: orgId,
        promptName: promptEditData?.promptName,
        promptCategory: promptEditData?.promptCategory,
        introPrompt: promptEditData?.introPrompt,
        businessLogicType: promptEditData?.businessLogicType,
        closurePrompt: promptEditData?.closurePrompt,
        isOrganization: promptEditData?.isOrganization,
        promptText: promptEditData?.promptText,
        flowiseId: promptEditData?.flowiseId,
        promptId: promptEditData?.promptId,
      });
      setSkipValue((promptEditData?.flowisePage - 1)*5)
      setCurrentPage(promptEditData?.flowisePage)
    } else {
      // setPromptData(promptEditData);
    }
  }, [isEdit, promptEditData]);

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingX: isSmallScreen ? 2 : 4,
          paddingTop: 5,
          height: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        {isLoading && <PageLoader />}
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
            {!isEdit ? "New Prompt" : "Edit Prompt"}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {!isEdit ? "Create New Prompt" : ""}
          </Typography>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 5, paddingX: isSmallScreen ? 1 : 2 }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              gap: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: isSmallScreen ? "100%" : "40%",
              }}
            >
              <Typography sx={{ paddingX: 2, fontSize: 16, fontWeight: 600 }}>
                Prompt Name
              </Typography>
              <Input
                sx={{
                  width: "100%",
                  "&:before, &:after": {
                    display: "none",
                  },
                }}
                disabled={isEdit}
                value={promptData.promptName}
                placeholder="Please enter a name"
                onChange={(e) => handleOnChange("promptName", e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: isSmallScreen ? "100%" : "40%",
              }}
            >
              <Typography sx={{ paddingX: 2, fontSize: 16, fontWeight: 600 }}>
                Prompt Category
              </Typography>
              <Input
                sx={{
                  width: "100%",
                  "&:before, &:after": {
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    width: "100% !important",
                  },
                }}
                disabled={isEdit}
                value={promptData.promptCategory}
                placeholder="Please enter a category"
                onChange={(e) => handleOnChange("promptCategory", e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: isSmallScreen ? "100%" : "40%",
                color: "#333a63",
                alignItems: "center",
              }}
            >
              <Avatar />
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{email}</Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Organisation Prompt</Typography>
              <Typography sx={{ fontSize: 16 }}>
                Share this prompt with the rest of the organisation
              </Typography>
            </Box>

            <Switch
              checked={promptData.isOrganization}
              onChange={(e) => handleOnChange("isOrganization", e.target.checked)}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Intro Prompt</Typography>
              <Typography sx={{ fontSize: 16 }}>Write your Intro Prompt Message</Typography>
            </Box>

            <TextEditor initialValue={promptData.introPrompt} onChange={handleIntroPrompt} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Business Logic</Typography>
              <Typography sx={{ fontSize: 16 }}>Write your Business Logic</Typography>
            </Box>
            <Tabs
              sx={{
                width: isMediumScreen ? "70%" : "30%",
                margin: "20px 60px",
                display: "flex",
                justifyContent: isMediumScreen ? "center" : "start",
                alignItems: "start",
              }}
              value={tabValue}
              onChange={handleChange}
              aria-label="Source Type Tabs"
            >
              <Tab sx={{ fontSize: "13px" }} label="Prompt" value="prompt" />
              <Tab sx={{ fontSize: "13px" }} label="Flow" value="flow" />
            </Tabs>

            {tabValue === "prompt" && (
              <TextEditor initialValue={promptData.promptText} onChange={handleBusiLogic} />
            )}
            {tabValue === "flow" && (
              <>
                {flowiseLoading && <Box sx={{ display: "flex", justifyContent:"center"}}>
                  <CircularProgress />
                </Box>}
                {!flowiseLoading && <FlowListTable
                  data={getAllChatflowsApi?.data?.data}
                  images={images}
                  isLoading={isLoading}
                  filterFunction={filterFlows}
                  updateFlowsApi={getAllChatflowsApi}
                  setError={setError}
                  tabValue={isEdit ? promptData?.businessLogicType : tabValue}
                />}
              </>
            )}

            {tabValue === "flow" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  marginTop: 0,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  variant="outlined"
                  color="primary"
                  renderItem={(item) => <PaginationItem {...item} />}
                  onChange={(event, page) => {
                    handlePage(page); setCurrentPage(page); setFlowiseLoading(true)
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Closure Prompt</Typography>
              <Typography sx={{ fontSize: 16 }}>Write your Closure Prompt</Typography>
            </Box>

            <TextEditor initialValue={promptData.closurePrompt} onChange={handlClosurePrompt} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: isSmallScreen ? "center" : "flex-end",
              alignItems: isSmallScreen ? "center" : "flex-end",
              gap: 2,
              flexDirection: isSmallScreen ? "column" : "row",
              paddingTop: isSmallScreen ? "60px" : "0px",
            }}
          >
            {isEdit && (
              <SoftButton
                color="light"
                onClick={handleCancel}
                sx={{
                  width: isSmallScreen ? "100%" : "auto",
                }}
              >
                CANCEL
              </SoftButton>
            )}

            {!isEdit ? (
              <SoftButton
                variant="gradient"
                color="dark"
                onClick={handleCreatePrompt}
                sx={{
                  width: isSmallScreen ? "100%" : "auto",
                }}
                disabled={isLoading}
              >
                CREATE PROMPT
              </SoftButton>
            ) : (
              <SoftButton
                variant="gradient"
                color="dark"
                onClick={handleUpdatePrompt}
                sx={{
                  width: isSmallScreen ? "100%" : "auto",
                }}
              >
                UPDATE PROMPT
              </SoftButton>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
