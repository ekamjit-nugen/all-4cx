import {
  updateVersion,
  updatePromptId,
  setPromptLoading,
  updatePromptData,
  updateEditPromptData,
  updateEditPromptStatus,
} from "store/features/promptSlice";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import fetchData from "../../../../services/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { updateFlowData } from "store/features/promptSlice";
import PageLoader from "../../../../components/page-loader";
import { updateVersionChanged } from "store/features/reactFlowSlice";
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
import { initialPromptOrganisationData, initialPromptProjectData } from "../../prompt-flow/const";
import SoftTypography from "components/soft-typography";
import promptApi from "@/api/prompt";

const PromptProjectListing = ({ promptType,promptId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgId, userId } = useAuth();
  const reduxData = useSelector((state) => state.prompt.data);
  const isLoading = useSelector((state) => state.prompt.loading);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const versionStatus = useSelector((state) => state.reactFlow.isVersion);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(7);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const [projectListingState, setProjectListingState] = useState({
    anchorEl: null,
    subMenuAnchorEl: null,
    promptEditData: [],
    projectPromptList: [],
  });

  const handleOpenEdit = (event, data) => {
    setProjectListingState({
      ...projectListingState,
      anchorEl: event.currentTarget,
      promptEditData: data,
    });
  };

  const handleCloseEdit = () => {
    setProjectListingState({
      ...projectListingState,
      anchorEl: null,
      subMenuAnchorEl: null,
    });
  };

  const handleMenuItemClick = (action) => {
    dispatch(updatePromptId(projectListingState?.promptEditData?.prompt_id));
    if (action === "edit") {
      navigate("/prompt/createPrompt");
      dispatch(updateEditPromptStatus(true));
      dispatch(updateEditPromptData(projectListingState?.promptEditData));
      dispatch(updateVersionChanged(false));
      dispatch(updateVersion(projectListingState?.promptEditData?.version));
      navigate("/prompt/createPrompt",{state:{name:projectListingState?.promptEditData?.prompt_title}});
    } else if (action.startsWith("version")) {
      dispatch(setPromptLoading(true));
      const versionNumber = parseInt(action.replace("version", ""), 10);
      dispatch(updateVersion(1));
      dispatch(updatePromptId(projectListingState?.promptEditData?.prompt_id));
      fetchVersionData(projectListingState?.promptEditData?.prompt_id, versionNumber);
    } else if (action === "archive") {
      handleArchiveFunction("archive");
    } else if (action === "clone") {
      handleCloneFunction(
        projectListingState?.promptEditData?.prompt_id,
        projectListingState?.promptEditData?.version
      );
    } else if (action === "unarchive") {
      handleArchiveFunction("unarchive");
    }
    handleCloseEdit();
  };

  const handleOpenSubMenu = (event) => {
    setProjectListingState({
      ...projectListingState,
      subMenuAnchorEl: event.currentTarget,
    });
  };

  const handleCloseSubMenu = () => {
    setProjectListingState({
      ...projectListingState,
      anchorEl: null,
      subMenuAnchorEl: null,
    });
  };

  const fetchProjectData = async () => {
    dispatch(setPromptLoading(true));
    if (promptType === "project") {
      
      try{
        if(promptId!="All"){
          const response= await promptApi.getPromptListData(orgId,projectId,promptId)
          setProjectListingState({
            ...projectListingState,
            anchorEl: null,
            subMenuAnchorEl: null,
            projectPromptList: response?.data?.data,
          });
          dispatch(setPromptLoading(false));
          dispatch(updateEditPromptData(response?.data?.data));
        }
        else{
          const response = await fetchData(
            `/prompt?organizationId=${orgId}&projectId=${projectId}`,
            "GET"
          );setProjectListingState({
            ...projectListingState,
            anchorEl: null,
            subMenuAnchorEl: null,
            projectPromptList: response?.data,
          });
          dispatch(setPromptLoading(false));
          dispatch(updateEditPromptData(response?.data));
        }
      }catch(error){
        console.error(error,"error")
      }
    } else if (promptType === "organisation") {
      try{
        if(promptId!="All"){
          const response= await promptApi.getPromptListDataOrg(orgId,projectId,promptId)
          setProjectListingState({
            ...projectListingState,
            anchorEl: null,
            subMenuAnchorEl: null,
            projectPromptList: response?.data?.data,
          });
          dispatch(setPromptLoading(false));
          dispatch(updateEditPromptData(response?.data?.data));
        }
        else{
          const response = await fetchData(
            `/prompt?organizationId=${orgId}&projectId=${projectId}&isOrganization=${true}`,
            "GET"
          );
          setProjectListingState({
            ...projectListingState,
            anchorEl: null,
            subMenuAnchorEl: null,
            projectPromptList: response?.data,
          });
          dispatch(setPromptLoading(false));
          dispatch(updateEditPromptData(response?.data));
        }

      }catch(error){
        console.error(error,"error")
      }
    } else if (promptType === "archived") {
      const response = await fetchData(
        `/prompt/organizations/${orgId}/projects/${projectId}/authors/${userId}/prompt?archive=true`,
        "GET"
      );
      setProjectListingState({
        ...projectListingState,
        anchorEl: null,
        subMenuAnchorEl: null,
        projectPromptList: response?.data,
      });
      dispatch(setPromptLoading(false));
      dispatch(updateEditPromptData(response?.data));
    }
  };

  const fetchVersionData = async (promptId, version) => {
    const response = await fetchData(`/prompt/${promptId}/version/${version}`, "GET");
    dispatch(updatePromptData(response?.data));
    dispatch(updateFlowData(response?.data));
    dispatch(updateVersionChanged(true));
    dispatch(setPromptLoading(false));
  };

  const handleCloneFunction = async (promptId, version) => {
    try {
      const payload = {
        promptId,
        version,
        userId,
        projectId,
      };
      await fetchData(`/prompt/clone`, "POST", payload);
      toast.success("Prompt cloned successfully.");
      fetchProjectData();
    } catch (error) {
      toast.error("Cannot clone prompt");
    }
  };

  const handleArchiveFunction = async (value) => {
    try {
      const payload = {
        userId: userId,
        status: value === "unarchive" ? false : true,
        organizationId: orgId,
        projectId,
      };
      const response = await fetchData(
        `/prompt/${projectListingState?.promptEditData?.prompt_id}/version/${projectListingState?.promptEditData?.version}`,
        "PATCH",
        payload
      );
      toast.success(`Prompt ${value} successfully.`);
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to archive prompt.");
    }
  };

  // const handleFlowFunction = (data) => {
  //   if (data?.json_prompt_flow) {
  //     const { edges, nodes } = data.json_prompt_flow;

  //     const JsonData = {
  //       edges: JSON.parse(JSON.stringify(edges || [])),
  //       nodes: JSON.parse(JSON.stringify(nodes || [])),
  //     };
  //     dispatch(updateFlowData(JsonData));
  //   } else {
  //     dispatch(
  //       updateFlowData({
  //         edges: initialEdges,
  //         nodes: initialNodes,
  //         promptId: data?.prompt_id,
  //         version: data?.version,
  //       })
  //     );
  //   }

  //   navigate("/prompt/flow");
  // };

  const handleAddButton = () => {
    if (promptType === "organisation") {
      dispatch(updateEditPromptData(initialPromptOrganisationData));
      dispatch(updateEditPromptStatus(false));
      navigate("/prompt/createPrompt",{state:{name:'org'}});
    } else {
      dispatch(updateEditPromptData(initialPromptProjectData));
      dispatch(updateEditPromptStatus(false));
      navigate("/prompt/createPrompt");
    }
  };
  useEffect(() => {
    if (projectId != null) fetchProjectData();
  }, [promptType, projectId,promptId]);

  useEffect(() => {
    if (versionStatus)
      setProjectListingState({
        ...projectListingState,
        projectPromptList: reduxData,
      });
  }, [reduxData]);

  const totalPages = Math.ceil(totalDataCount / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalDataCount);

  useEffect(() => {
    const value = reduxData;
    if (value.length > 0) setTotalDataCount(value?.length);
    else if (value === null) setTotalDataCount(value?.length);
  }, [reduxData]);

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
        {isLoading ? (
          <PageLoader />
        ) : (
          Array.isArray(projectListingState.projectPromptList) && 
          projectListingState.projectPromptList
            .slice(startIndex, endIndex) // Slice data according to pagination
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
                    {promptType === "archived" && (
                      <Typography
                        sx={{
                          fontSize: isMediumScreen ? 8 : 12,
                          fontWeight: 900,
                          color: "steelblue",
                          padding: 1,
                          paddingLeft: 2,
                        }}
                      >
                        Type: {item.prompt_type}
                      </Typography>
                    )}
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
                        {item?.runs}
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
                      {item.prompt_title}
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

        {promptType != "archived" && (
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
        anchorEl={projectListingState.anchorEl}
        open={Boolean(projectListingState.anchorEl)}
        onClose={handleCloseEdit}
        sx={{
          width: isMediumScreen ? "90vw" : "auto",
          maxWidth: "400px",
        }}
      >
        {promptType != "archived" && (
          <>
            <MenuItem
              onClick={() => handleMenuItemClick("edit")}
              disabled={projectListingState?.promptEditData?.author !== userId}
              sx={{
                fontSize: isMediumScreen ? "0.875rem" : "1rem",
                padding: isMediumScreen ? "8px 16px" : "12px 24px",
              }}
            >
              Edit Prompt
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
          onClick={() => handleMenuItemClick(promptType === "archived" ? "unarchive" : "archive")}
          disabled={
            promptType === "organisation" || projectListingState?.promptEditData?.author !== userId
          }
          sx={{
            fontSize: isMediumScreen ? "0.875rem" : "1rem",
            padding: isMediumScreen ? "8px 16px" : "12px 24px",
          }}
        >
          {promptType === "archived" ? "UnArchive" : "Archive"}
        </MenuItem>
        {promptType != "archived" && (
          <MenuItem
            onClick={() => handleMenuItemClick("clone")}
            sx={{
              fontSize: isMediumScreen ? "0.875rem" : "1rem",
              padding: isMediumScreen ? "8px 16px" : "12px 24px",
            }}
          >
            Clone
          </MenuItem>
        )}
      </Menu>

      <Menu
        anchorEl={projectListingState.subMenuAnchorEl}
        open={Boolean(projectListingState.subMenuAnchorEl)}
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
        {projectListingState?.promptEditData?.versions?.map((version) => (
          <MenuItem
            key={`version-${version}`}
            onClick={() => handleMenuItemClick(`version${version}`)}
          >
            Version {version}
          </MenuItem>
        ))}
      </Menu>
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

export default PromptProjectListing;
