import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, CircularProgress } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, Position } from "@xyflow/react";
import OutputModal from "./output-modal";
import { useSelector } from "react-redux";
import fetchData from "services/api";
import { useDispatch } from "react-redux";
import { updateAgentData } from "store/features/chatSlice";
import { updateUserData } from "store/features/chatSlice";
import { updateOutputData } from "store/features/chatSlice";
import { updateApiLoading } from "store/features/chatSlice";
import { updateShowOutputData } from "store/features/reactFlowSlice";
import useReactFlowOutputJson from "hooks/useReactFlowOutputJson";

const OutPutNode = ({
  data,
  isConnectable,
  isShowOutputEnabled,
  flowDataJson,
  value,
  snackBarMessage,
  onRemoveNode,
}) => {
  const [closeComponent, setCloseComponent] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const outputData = useSelector((state) => state.reactFlow.showOutputData);
  const dispatch = useDispatch();
  const { extractRelevantData } = useReactFlowOutputJson();

  const handleClose = () => {
    setCloseComponent(false);
    onRemoveNode();
  };

  const handleShowOutput = () => {
    snackBarMessage("Generating Output");
    const relevantData = extractRelevantData(flowDataJson);
    if (relevantData) {
      dispatch(updateShowOutputData(relevantData));
      setOpenModal(true);
      dispatch(updateOutputData(relevantData));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    const text = flowDataJson?.nodes?.find((node) => node.type === "text")?.data?.promptData
      ?.promptData?.prompt_text;
    const val = stripHtmlTags(text);
  }, [flowDataJson]);

  return closeComponent ? (
    <>
      <Box
        sx={{
          padding: 1,
          border: "2px solid #94ee64",
          borderRadius: 2,
          width: 200,
          background: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MoreHorizIcon
            sx={{
              height: "8px",
              width: "8px",
              color: "gray",
              stroke: "gray",
              strokeWidth: 1,
              backgroundColor: "none",
            }}
          />
        </Box>
        <Box sx={{ display: "grid", alignItems: "start" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: "10px", marginBottom: 1, fontWeight: "700" }}>
              Output
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(148, 238, 100, 0.2)",
                  borderRadius: "50%",
                  transform: "scale(0.8)",
                },
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <CloseIcon
                sx={{
                  height: "12px",
                  width: "12px",
                  color: "#94ee64",
                  stroke: "#94ee64",
                  strokeWidth: 1,
                  backgroundColor: "none",
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
            <Button
              onClick={handleShowOutput}
              size="small"
              disabled={!isShowOutputEnabled}
              sx={{
                border: "1px solid #a5e6a6",
                borderRadius: 1,
                fontSize: "8px",
                color: "#347333",
                padding: "3px 3px",
                "&:hover": {
                  backgroundColor: "#e3fbe3",
                  color: "#347333",
                },
              }}
            >
              Show Output
            </Button>
          </Box>
        </Box>
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      </Box>
      <OutputModal open={openModal} handleClose={handleCloseModal} data={outputData} />
    </>
  ) : null;
};

export default OutPutNode;
