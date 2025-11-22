import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// material-ui
import { Box, Pagination, PaginationItem, Paper, Skeleton, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project imports
import MainCard from "@/ui-component/cards/MainCard";
import ItemCard from "@/ui-component/cards/ItemCard";
import { gridSpacing } from "@/store/constant";
import WorkflowEmptySVG from "@/assets/images/workflow_empty.svg";
import LoginDialog from "@/ui-component/dialog/LoginDialog";
import ConfirmDialog from "@/ui-component/dialog/ConfirmDialog";
import { FlowListTable } from "@/ui-component/table/FlowListTable";
import { StyledButton } from "@/ui-component/button/StyledButton";
import ViewHeader from "@/layout/MainLayout/ViewHeader";
import ErrorBoundary from "@/ErrorBoundary";

// API
import chatflowsApi from "@/api/chatflows";

// Hooks
import useApi from "@/hooks/useApi";

// const
import { baseURL } from "@/store/constant";

// icons
import { IconPlus, IconLayoutGrid, IconList } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import PromptTypeTab from "pages/prompts/prompt-flow/modules/tabs/prompt-type-tabs";

// ==============================|| CHATFLOWS ||============================== //

const Chatflows = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [search, setSearch] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogProps, setLoginDialogProps] = useState({});

  const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows);
  const getOrgChatflowsApi = useApi(chatflowsApi.getOrgChatflows);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [view, setView] = useState(localStorage.getItem("flowDisplayStyle") || "card");
  const projectId = useSelector((state) => state.projectIdList);
  const [flowType, setFlowType] = useState("project");
  const [skipValue, setSkipValue] = useState(0);

  const totalPages = Math.ceil(totalDataCount / 9);

  const handleChange = (event, nextView) => {
    if (nextView === null) return;
    localStorage.setItem("flowDisplayStyle", nextView);
    setView(nextView);
  };

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filterFlows = (data) => {
    return (
      data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1)
    );
  };

  const onLoginClick = (username, password) => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    navigate(0);
  };

  const addNew = () => {
    navigate("/orchestrate/canvas", { state: { flowType } });
  };

  const goToCanvas = (selectedChatflow) => {
    navigate(`/canvas/${selectedChatflow.id}`, { state: { name: selectedChatflow?.name } });
  };

  useEffect(() => {
    if (projectId?.orgId && projectId?.projectId) {
      if (flowType === "project") {
        getAllChatflowsApi.request(projectId,skipValue);
      } else {
        getOrgChatflowsApi.request(projectId,skipValue);
      }
    }
  }, [projectId?.orgId, projectId?.projectId, flowType,skipValue]);

  useEffect(() => {
    if (flowType === "project") {
      if (getAllChatflowsApi.error) {
        if (getAllChatflowsApi.error?.response?.status === 401) {
          setLoginDialogProps({
            title: "Login",
            confirmButtonName: "Login",
          });
          setLoginDialogOpen(true);
        } else {
          setError(getAllChatflowsApi.error);
        }
      }
    } else {
      if (getOrgChatflowsApi.error) {
        if (getOrgChatflowsApi.error?.response?.status === 401) {
          setLoginDialogProps({
            title: "Login",
            confirmButtonName: "Login",
          });
          setLoginDialogOpen(true);
        } else {
          setError(getOrgChatflowsApi.error);
        }
      }
    }
  }, [getAllChatflowsApi.error, getOrgChatflowsApi.error]);
  function handlePage(value) {
    setSkipValue((value - 1) * 9);
  }

  useEffect(() => {
    if (flowType === "project") {
      setLoading(getAllChatflowsApi.loading);
    } else {
      setLoading(getOrgChatflowsApi.loading);
    }
  }, [getAllChatflowsApi.loading, getOrgChatflowsApi.loading]);

  useEffect(() => {
    if (flowType === "project") {
      if (getAllChatflowsApi?.data) {
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
    } else {
      if (getOrgChatflowsApi?.data) {
        try {
          const chatflows = getOrgChatflowsApi?.data?.data;
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
    }
  }, [getAllChatflowsApi?.data, getOrgChatflowsApi?.data]);

  return (
    <Paper
      sx={{
        height: "calc(100vh - 200px)",
        overflow: "scroll",
      }}
    >
      <>
        <MainCard>
          {error ? (
            <ErrorBoundary error={error} />
          ) : (
            <Stack flexDirection="column" sx={{ gap: 3 }}>
              <PromptTypeTab
                promptType={flowType}
                onChange={(value) => {
                  setFlowType(value);
                }}
                archived={false}
              />
              <ViewHeader
                onSearchChange={onSearchChange}
                search={true}
                searchPlaceholder="Search Name or Category"
                title="Chatflows"
              >
                <ToggleButtonGroup
                  sx={{ borderRadius: 2, maxHeight: 40 }}
                  value={view}
                  color="primary"
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton
                    sx={{
                      borderColor: theme.palette.grey[900] + 25,
                      borderRadius: 2,
                      color: theme?.customization?.isDarkMode ? "white" : "inherit",
                    }}
                    variant="contained"
                    value="card"
                    title="Card View"
                  >
                    <IconLayoutGrid />
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      borderColor: theme.palette.grey[900] + 25,
                      borderRadius: 2,
                      color: theme?.customization?.isDarkMode ? "white" : "inherit",
                    }}
                    variant="contained"
                    value="list"
                    title="List View"
                  >
                    <IconList />
                  </ToggleButton>
                </ToggleButtonGroup>
                <StyledButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<IconPlus />}
                  sx={{ borderRadius: 2, height: 40, width: 230 }}
                >
                  Add New
                </StyledButton>
              </ViewHeader>
              {!view || view === "card" ? (
                <>
                  {isLoading ? (
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                      <Skeleton variant="rounded" height={160} />
                      <Skeleton variant="rounded" height={160} />
                      <Skeleton variant="rounded" height={160} />
                    </Box>
                  ) : (
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                      {flowType === "project" &&
                        getAllChatflowsApi.data?.data
                          ?.filter?.(filterFlows)
                          .map((data, index) => (
                            <ItemCard
                              key={index}
                              onClick={() => goToCanvas(data)}
                              data={data}
                              images={images[data.id]}
                            />
                          ))}
                      {flowType === "organisation" &&
                        getOrgChatflowsApi.data?.data
                          ?.filter?.(filterFlows)
                          .map((data, index) => (
                            <ItemCard
                              key={index}
                              onClick={() => goToCanvas(data)}
                              data={data}
                              images={images[data.id]}
                            />
                          ))}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {flowType === "project" && (
                    <FlowListTable
                      data={getAllChatflowsApi?.data?.data}
                      images={images}
                      isLoading={isLoading}
                      filterFunction={filterFlows}
                      updateFlowsApi={getAllChatflowsApi}
                      setError={setError}
                    />
                  )}

                  {flowType === "organisation" && (
                    <FlowListTable
                      data={getOrgChatflowsApi?.data?.data}
                      images={images}
                      isLoading={isLoading}
                      filterFunction={filterFlows}
                      updateFlowsApi={getOrgChatflowsApi}
                      setError={setError}
                    />
                  )}
                </>
              )}

              {flowType === "project" &&
                !isLoading &&
                (!getAllChatflowsApi?.data?.data ||
                  getAllChatflowsApi?.data?.data.length === 0) && (
                  <Stack
                    sx={{ alignItems: "center", justifyContent: "center" }}
                    flexDirection="column"
                  >
                    <Box sx={{ p: 2, height: "auto" }}>
                      <img
                        style={{ objectFit: "cover", height: "25vh", width: "auto" }}
                        src={WorkflowEmptySVG}
                        alt="WorkflowEmptySVG"
                      />
                    </Box>
                    <div>No Chatflows Yet</div>
                  </Stack>
                )}

              {flowType === "organisation" &&
                !isLoading &&
                (!getOrgChatflowsApi?.data?.data ||
                  getOrgChatflowsApi?.data?.data.length === 0) && (
                  <Stack
                    sx={{ alignItems: "center", justifyContent: "center" }}
                    flexDirection="column"
                  >
                    <Box sx={{ p: 2, height: "auto" }}>
                      <img
                        style={{ objectFit: "cover", height: "25vh", width: "auto" }}
                        src={WorkflowEmptySVG}
                        alt="WorkflowEmptySVG"
                      />
                    </Box>
                    <div>No Chatflows Yet</div>
                  </Stack>
                )}
            </Stack>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              marginTop: 4,
            }}
          >
            <Pagination
              count={totalPages}
              variant="outlined"
              color="primary"
              renderItem={(item) => <PaginationItem {...item} />}
              onChange={(event, page) => {
                handlePage(page);
              }}
            />
          </Box>
          <LoginDialog
            show={loginDialogOpen}
            dialogProps={loginDialogProps}
            onConfirm={onLoginClick}
          />
          <ConfirmDialog />
        </MainCard>
      </>
    </Paper>
  );
};

export default Chatflows;
