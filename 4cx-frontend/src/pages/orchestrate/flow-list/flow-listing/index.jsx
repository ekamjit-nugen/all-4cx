import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import fetchData from "../../../../services/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PageLoader from "../../../../components/page-loader";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Grid,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { updateFlowStatus } from "store/features/reactFlowSlice";
import { updateFlowData } from "store/features/promptSlice";
import { updateReactFlowData } from "store/features/reactFlowSlice";
import { updateVersion } from "store/features/promptSlice";
import { updateFlowVersion } from "store/features/promptSlice";
import { updateFlowName } from "store/features/promptSlice";
import { updateSelectedPrompt } from "store/features/reactFlowSlice";
import { updatePromptId } from "store/features/promptSlice";
import { setUpdateOrchestrateId } from "store/features/projectIdSlice";
import { setChatModel } from "store/features/projectIdSlice";
import { resetChatData } from "store/features/chatSlice";
import { updateSelectedPromptVersion } from "store/features/reactFlowSlice";
import { updateFlowListData } from "store/features/reactFlowSlice";
import { setFlowListData } from "store/features/reactFlowSlice";
import { setReactFlowLoading } from "store/features/reactFlowSlice";
import SoftTypography from "components/soft-typography";

const FlowListing = ({ flowType }) => {
  const dispatch = useDispatch();
  const router = useNavigate();
  const { orgId, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const reactFlowLoading = useSelector((state) => state.reactFlow.loading);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const reduxFlowListData = useSelector((state) => state.reactFlow.flowListData);
  const [selectedVersion, setSelectedVersion] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(7);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [flowListingState, setFlowListingState] = useState({
    anchorEl: null,
    subMenuAnchorEl: null,
    flowList: [],
    flowEditData: [],
  });

  const handleOpenEdit = (event, data) => {
    setFlowListingState({
      ...flowListingState,
      anchorEl: event.currentTarget,
      flowEditData: data,
    });
  };

  const handleCloseEdit = () => {
    setFlowListingState({
      ...flowListingState,
      anchorEl: null,
      subMenuAnchorEl: null,
    });
  };

  const handleMenuItemClick = (action) => {
    if (action === "edit") {
      if (flowListingState?.flowEditData != undefined) {
        const data = flowListingState?.flowEditData;
        // const version =
        //   selectedVersion?.[data?._id] ||
        //   data.versions[data.versions?.length - 1] ||
        //   data.prompt_versions[data.prompt_versions?.length - data.prompt_versions?.length];


        const { edges, nodes } = data?.json_prompt_flow || { edges: [], nodes: [] };
        const JsonData = {
          edges: JSON.parse(JSON.stringify(edges || [])),
          nodes: JSON.parse(JSON.stringify(nodes || [])),
        };
        dispatch(updateFlowStatus(true));
        dispatch(updateFlowData(JsonData));
        dispatch(updateReactFlowData(data));
        dispatch(updateVersion(data?.version));
        // dispatch(updateFlowVersion());
        dispatch(updateFlowName(data?.flow_name));
        dispatch(updateSelectedPrompt(JsonData));
        dispatch(updatePromptId(data?.prompt_id));
        dispatch(setUpdateOrchestrateId(data?._id));
        dispatch(updateSelectedPromptVersion(data?.versions));
        dispatch(setChatModel(data?.json_prompt_flow?.nodes?.[2]?.data?.selectedValue?.value));
      } else {
        dispatch(
          updateFlowData({
            edges: initialEdges,
            nodes: initialNodes,
            promptId: data?.prompt_id,
            version: data?.version,
          })
        );
      }
      dispatch(resetChatData());
      router("/orchestrate/createOrchestrate");
    } else if (action.startsWith("version")) {
      dispatch(setReactFlowLoading(true));
      const versionNumber = parseInt(action.replace("version", ""), 10);
      handleGetDataByVersion(flowListingState?.flowEditData?.flow_name, versionNumber);
    } else if (action === "archive") {
      handleArchive("archive");
    } else if (action === "unarchive") {
      handleArchive("unarchive");
    }
    handleCloseEdit();
  };

  const handleOpenSubMenu = (event) => {
    setFlowListingState({
      ...flowListingState,
      subMenuAnchorEl: event.currentTarget,
    });
  };

  const handleCloseSubMenu = () => {
    setFlowListingState({
      ...flowListingState,
      anchorEl: null,
      subMenuAnchorEl: null,
    });
  };

  const handleGetDataByVersion = async (title, version) => {
    try {
      const response = await fetchData(
        `/orchestrate/projects/${projectId}/authors/${userId}/flows`,
        "POST",
        {
          title,
          version,
        }
      );
      dispatch(updateFlowListData(response?.data));
      dispatch(setReactFlowLoading(false));
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const handleArchive = async (value) => {
    const data = flowListingState?.flowEditData;
    try {
      const payload = {
        version: data?.version,
        status: value === "archive" ? true : false,
        flow_name: data?.flow_name,
        organizationId: orgId,
        projectId,
      };
      const response = fetchData(
        `/orchestrate/projects/${data?.project_id}/authors/${userId}/flows`,
        "PATCH",
        payload
      );
      if (response) {
        toast(response?.message);
      }
      fetchPromptData();
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const handleAddButton = () => {
    router("/orchestrate/createOrchestrate");
  };

  useEffect(() => {
    setIsLoading(true);
    if (orgId && userId && projectId) {
      fetchPromptData();
    }
  }, [orgId, userId, projectId, flowType]);

  const fetchPromptData = async () => {
    try {
      setIsLoading(true);
      let url = `/orchestrate/projects/${projectId}/authors/${userId}/flows`;
      if (flowType === "archived") {
        url += `?archive=true`;
      }
      const response = await fetchData(url, "GET");
      if (response.data && response.data.length > 0) {
        setFlowListData(response?.data);
        setFlowListingState({
          ...flowListingState,
          anchorEl: null,
          subMenuAnchorEl: null,
          flowList: response?.data,
        });
        dispatch(setFlowListData(response?.data));
      } else {
        setFlowListData(response?.data);
        setFlowListingState({
          ...flowListingState,
          anchorEl: null,
          subMenuAnchorEl: null,
          flowList: response?.data,
        });
        // console.error("Expected an array of data");
        // setFlowListingState({
        //   ...flowListingState,
        //   flowList: [],
        // });
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const value = flowListingState.flowList;
    if (value.length > 0) setTotalDataCount(value?.length);
    else if (value === null) setTotalDataCount(value?.length);
  }, [flowListingState.flowList]);

  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);

  return (
    <Box sx={{ paddingX: 4 }}>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: isMediumScreen ? "center" : "start",
          paddingTop: 5,
        }}
      >
        {isLoading || reactFlowLoading ? (
          <PageLoader />
        ) : (
          // Calculate start and end indexes based on pagination
          flowListingState.flowList
            .slice(startIndex, endIndex) // Implement pagination here
            .map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    position: "relative",
                    width: isLargeScreen ? "60%" : "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingX: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: isMediumScreen ? 8 : 12,
                        fontWeight: 900,
                        color: "steelblue",
                        padding: 1,
                      }}
                    >
                      Version: {item.version}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: isMediumScreen ? 8 : 12,
                        fontWeight: 900,
                        color: "steelblue",
                        padding: 1,
                        paddingLeft: 2,
                      }}
                    >
                      {item.isCloned ? "Cloned" : null}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: isMediumScreen ? "space-between" : "start",
                      gap: 2,
                      paddingX: isMediumScreen ? 1 : 2,
                      paddingBottom: 1,
                    }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        width: "60%",
                        display: "flex",
                        borderRadius: 3,
                        flexDirection: "column",
                        paddingX: 2,
                        paddingY: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: isMediumScreen ? 12 : 14,
                          fontWeight: 900,
                          color: "#8e8c8c",
                        }}
                      >
                        Category:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: isMediumScreen ? 12 : 14,
                          color: "black",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.category}
                      </Typography>
                    </Paper>
                    <Paper
                      elevation={2}
                      sx={{
                        width: "30%",
                        display: "flex",
                        borderRadius: 4,
                        alignItems: "start",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingX: 2,
                        paddingY: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: isMediumScreen ? 12 : 14,
                          fontWeight: 900,
                          color: "#8e8c8c",
                        }}
                      >
                        Runs:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: isMediumScreen ? 12 : 14,
                          color: "#6bd888",
                        }}
                      >
                        {item?.runs || 0}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingX: 3,
                      paddingY: 1,
                      borderTop: "1px solid lightgrey",
                      height: 40,
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: isMediumScreen ? 12 : 14, fontWeight: 900, color: "Gray" }}
                    >
                      {item.flow_name}
                    </Typography>
                    <MoreVertIcon
                      onClick={(e) => handleOpenEdit(e, item)}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))
        )}

        {flowType != "archived" && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                color: "gray",
                display: "flex",
                borderRadius: 4,
                paddingX: 10,
                paddingY: 5,
                height: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                border: "1px solid lightGray",
                "&:hover": {
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleAddButton()}
            >
              <AddIcon fontSize="large" />
            </Box>
          </Grid>
        )}
      </Grid>

      <Menu
        anchorEl={flowListingState.anchorEl}
        open={Boolean(flowListingState.anchorEl)}
        onClose={handleCloseEdit}
        sx={{
          width: isMediumScreen ? "90vw" : "auto",
          maxWidth: "400px",
        }}
      >
        {flowType != "archived" && (
          <>
            <MenuItem
              onClick={() => handleMenuItemClick("edit")}
              sx={{
                fontSize: isMediumScreen ? "0.875rem" : "1rem",
                padding: isMediumScreen ? "8px 16px" : "12px 24px",
              }}
            >
              Edit Flow
            </MenuItem>
            <MenuItem
              onClick={handleOpenSubMenu}
              sx={{
                display: "flex",
                gap: 3,
                fontSize: isMediumScreen ? "0.875rem" : "1rem",
                padding: isMediumScreen ? "8px 16px" : "12px 24px",
              }}
            >
              Change Version <ArrowForwardIosIcon />
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={() => handleMenuItemClick(flowType === "archived" ? "unarchive" : "archive")}
          sx={{
            fontSize: isMediumScreen ? "0.875rem" : "1rem",
            padding: isMediumScreen ? "8px 16px" : "12px 24px",
          }}
        >
          {flowType === "archived" ? "UnArchive" : "Archive"}
        </MenuItem>
      </Menu>

      {flowType != "archived" && (
        <Menu
          anchorEl={flowListingState.subMenuAnchorEl}
          open={Boolean(flowListingState.subMenuAnchorEl)}
          onClose={handleCloseSubMenu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {flowListingState?.flowEditData?.versions &&
            flowListingState?.flowEditData?.versions?.map((version) => (
              <MenuItem
                key={`version-${version}`}
                onClick={() => handleMenuItemClick(`version${version}`)}
              >
                Version {version}
              </MenuItem>
            ))}

          {flowListingState?.flowEditData?.orchestrate_versions &&
            flowListingState?.flowEditData?.orchestrate_versions?.map((version) => (
              <MenuItem
                key={`version-${version}`}
                onClick={() => handleMenuItemClick(`version${version}`)}
              >
                Version {version}
              </MenuItem>
            ))}
        </Menu>
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
    </Box>
  );
};

export default FlowListing;
