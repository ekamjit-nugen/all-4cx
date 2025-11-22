import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import fetchData from "../../../../services/api";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateFlowData } from "store/features/promptSlice";
import { updatePromptId } from "store/features/promptSlice";
import { updateVersion } from "store/features/promptSlice";
import { useSelector } from "react-redux";
import PageLoader from "../../../../components/page-loader";
import { initialEdges, initialNodes } from "../../create/react-flow/consts";
import { updateReactFlowData } from "store/features/reactFlowSlice";
import { updateSelectedPrompt } from "store/features/reactFlowSlice";
import { updateFlowStatus } from "store/features/reactFlowSlice";
import { resetChatData } from "store/features/chatSlice";
import { setUpdateOrchestrateId } from "store/features/projectIdSlice";
import { setChatModel } from "store/features/projectIdSlice";
import { updateFlowName } from "store/features/promptSlice";
import { updateFlowVersion } from "store/features/promptSlice";

function FlowListTable() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const { userId, orgId } = useAuth();
  const [promptData, setPromptData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const [selectedVersion , setSelectedVersion] = useState()

  useEffect(() => {
    if (orgId && userId && projectId) {
      fetchPromptData();
    }
  }, [orgId, userId, projectId]);

  const fetchPromptData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `/orchestrate/projects/${projectId}/authors/${userId}/flows`,
        "GET"
      );

      if (response.data && response.data.length > 0) {
        setPromptData(response.data);
      } else {
        console.error("Expected an array of data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAction = (data) => {
    if (data != undefined) {
      const { edges, nodes } = data?.json_prompt_flow || { edges: [], nodes: [] };
      const JsonData = {
        edges: JSON.parse(JSON.stringify(edges || [])),
        nodes: JSON.parse(JSON.stringify(nodes || [])),
      };
      dispatch(updateFlowStatus(true));
      dispatch(updateFlowData(JsonData));
      dispatch(updateReactFlowData(data));
      dispatch(updateVersion(data?.version));
      dispatch(updateFlowVersion(selectedVersion?.[data?._id] || data.versions[data.versions?.length - 1]));
      dispatch(updateFlowName(data?.flow_name));
      dispatch(updateSelectedPrompt(JsonData));
      dispatch(updatePromptId(data?.prompt_id));
      dispatch(setUpdateOrchestrateId(data?._id));
      dispatch(setUpdateOrchestrateId(data?._id));
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
  };

  const handleCreate = () => {
    dispatch(
      updateFlowData({
        edges: initialEdges,
        nodes: initialNodes,
      })
    );
    dispatch(updateReactFlowData([]));
    dispatch(updateFlowStatus(false));
    router("/orchestrate/createOrchestrate");
  };


  return (
    <Box pt={2} px={2}>
      {isLoading && <PageLoader />}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", mr: 2, fontSize: "20px" }}>Flow List</Typography>
        <Button
          sx={{
            border: "1px solid",
            fontSize: "14px",
            backgroundColor: "#0d6aca",
            padding: "5px 14px ",
            borderRadius: "10px",
            marginBottom: "8px",
            color: "white !important",
            "&:hover": {
              backgroundColor: "white",
              color: "#0d6aca !important",
            },
          }}
          onClick={handleCreate}
        >
          Create
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "8px", overflow: "hidden", marginTop: "20px" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableBody sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                Name
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                <span>Status</span> <SwapVertIcon fontSize="small" />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                <span>Version</span> <SwapVertIcon fontSize="small" />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: "gray", fontSize: "14px" }}>
                <span>Action</span> <SwapVertIcon fontSize="small" />
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            {promptData.length > 0 ? (
              promptData.map((prompt) => (
                <TableRow key={prompt._id} hover>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: "500" }}>
                    {prompt.flow_name}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "500" }}>
                    <Chip
                      label={prompt.archive_status ? "Archived" : "Active"}
                      color={prompt.archive_status ? "default" : "primary"}
                      sx={{
                        backgroundColor: prompt.archive_status ? "#e0e0e0" : "#4caf50",
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "500"}}>
                    <FormControl style={{minWidth: 60}}>
                    <Select
                      value={(+selectedVersion?.[prompt?._id] || prompt.versions[prompt.versions?.length - 1])||''}
                      onChange={(e)=>setSelectedVersion((prev)=>({...prev,[prompt?._id]:e.target.value}))}
                    >
                      {prompt.versions.map((v) => (
                        <MenuItem value={v} key={v}>
                          {v}
                        </MenuItem>
                      ))}
                    </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "500" }}>
                    <IconButton
                      sx={{ fontSize: "13px" }}
                      color="secondary"
                      onClick={() => handleViewAction(prompt)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ fontSize: "13px", fontWeight: "500" }} colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default FlowListTable;
