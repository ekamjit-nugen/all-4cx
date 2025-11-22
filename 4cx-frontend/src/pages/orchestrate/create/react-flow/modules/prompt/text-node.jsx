import React, { useState, useEffect, memo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
} from "@mui/material";
import PromptList from "./prompt-list";
import VersionList from "./version-list";
import { useAuth } from "@clerk/clerk-react";
import { Handle, Position } from "@xyflow/react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { updatePromptId } from "store/features/promptSlice";
import {} from "store/features/reactFlowSlice";
import {
  updateSelectedPrompt,
  updateSelectedPromptVersion,
  updateSelectedPromptDescription,
} from "store/features/reactFlowSlice";
import fetchData from "services/api";

const TextNode = memo(
  ({
    id,
    data,
    nodes,
    value,
    onRemoveNode,
    isConnectable,
    apiPromptData,
    isButtonDisabled,
    handlePromptState,
    handlePopupModal,
    handleDropdownChange,
    onUpdatePromptData,
  }) => {
    const dispatch = useDispatch();
    const { userId, orgId } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [dropdownPromptData, setDropdownPromptData] = useState([]);
    const [inputQueryText, setInputQueryText] = useState("");
    const [inputChatHistory, setInputChatHistory] = useState();
    const [closeComponent, setCloseComponent] = useState(true);
    const [inputSearchContext, setInputSearchContext] = useState("");
    const actionFlowData = useSelector((state) => state.reactFlow.reactFlowData);
    const updateNodeData = useSelector((state) => state.prompt.test);
    const promptDescriptionData = useSelector((state) => state.reactFlow.selectedPromptDescription);

    const [queryText, setQueryText] = useState({
      query: "{query}",
      chatHistory: "{chatHistory}",
      search: "{search}",
    });

    const handleClose = () => {
      setCloseComponent(false);
      onRemoveNode();
    };

    const handleAutocompleteChange = (event, newValue) => {
      const selectedPrompt = dropdownPromptData?.find(
        (item) => item?.prompt_id === newValue?.prompt_id
      );
      if (selectedPrompt) {
        const data = {
          prompt_id: selectedPrompt?.prompt_id,
          version: selectedPrompt?.version,
          prompt_text: selectedPrompt?.prompt_text,
        };
        dispatch(updateSelectedPrompt(data));
      }
      if (onUpdatePromptData) {
        onUpdatePromptData({ promptData: newValue });
      }
      dispatch(updateSelectedPromptVersion(selectedPrompt?.versions));
      dispatch(updatePromptId(selectedPrompt._id));
    };

    const handleVersionOnchange = (event, newValue) => {
      setDropdownVersionData(newValue);
      dispatch(updateSelectedPromptDescription(data?.promptData?.promptData));
    };

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const plainText =
      stripHtmlTags(promptDescriptionData?.data?.prompt_text || actionFlowData?.prompt_text) !==
      "undefined"
        ? stripHtmlTags(promptDescriptionData?.data?.prompt_text || actionFlowData?.prompt_text)
        : "";

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    return closeComponent ? (
      <Box
        sx={{
          padding: 1,
          border: "2px solid #fdd409",
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontSize: "10px", fontWeight: "700" }}>Prompt Text</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(253, 212, 9, 0.2)",
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
                color: "#fdd409",
                stroke: "#fdd409",
                strokeWidth: 1,
                backgroundColor: "none",
              }}
            />
          </IconButton>
        </Box>
        <PromptList
          selectedValue={value}
          options={apiPromptData}
          updateState={handleDropdownChange}
        />
        <VersionList
          selectedValue={value}
          options={apiPromptData}
          updateState={handleDropdownChange}
          onChange={(val) => onUpdatePromptData({ promptData: val })}
        />
        <Typography sx={{ fontSize: "9px", marginBottom: 1, mt: 2, fontWeight: "500" }}>
          Prompt Description
        </Typography>
        {data ? (
          <Card sx={{ maxWidth: 200, overflow: "hidden" }}>
            <CardContent sx={{ padding: 1, paddingBottom: "0px !important" }}>
              <Typography
                gutterBottom
                variant="body2"
                component="div"
                sx={{
                  fontSize: "12px",
                  textAlign: "left",
                  whiteSpace: "normal",
                  overflow: "auto !important",
                  wordBreak: "break-word",
                }}
              >
                {plainText ? (
                  <Box
                    sx={{
                      paddingBottom: 1,
                      paddingX: 1,
                      "&:hover": { color: "lightgrey", cursor: "pointer" },
                    }}
                    onClick={handleOpenDialog}
                  >
                    {plainText?.slice(0, 200)} ...
                  </Box>
                ) : (
                  ""
                )}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            padding: "15px 0px 5px 0px",
          }}
        >
          <Button
            onClick={handleOpenDialog}
            size="small"
            sx={{
              border: "1px solid #fdd409",
              borderRadius: 1,
              fontSize: "8px",
              color: "#e6c200",
              padding: "3px 3px",
              backgroundColor: "#fff9e6",
              "&:hover": {
                backgroundColor: "rgba(253, 212, 9, 0.9)",
                color: "#fff",
              },
            }}
            queryvalue={nodes}
            disabled={!value.selectedPromptValue || !value.selectedPromptValue}
          >
            Show Data
          </Button>
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Prompt Data
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon sx={{ fontSize: "20px !important" }} />
            </IconButton>
          </DialogTitle>
          <Card sx={{ maxWidth: 600, margin: 2, boxShadow: 3 }}>
            <CardContent
              sx={{
                padding: 3,
                maxHeight: 600,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ marginBottom: 3, fontWeight: "bold", textDecoration: "underline" }}
              >
                Details:
              </Typography>

              {plainText && (
                <Typography variant="body2" component="div" sx={{ marginBottom: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#5b2c6f" }}>
                    Prompt Text:
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "16px", fontWeight: "500" }}>
                    <div
                      dangerouslySetInnerHTML={{ __html:  promptDescriptionData?.data?.prompt_text || actionFlowData?.prompt_text}}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  </Typography>
                </Typography>
              )}

              {inputQueryText && (
                <Typography variant="body2" component="div" sx={{ marginBottom: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#760000" }}>
                    Input Query:
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "16px", fontWeight: "500" }}>
                    {inputQueryText}
                  </Typography>
                </Typography>
              )}

              {inputChatHistory && (
                <Typography variant="body2" component="div" sx={{ marginBottom: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#005376" }}>
                    Chat History:
                  </Typography>
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {JSON.stringify(inputChatHistory, null, 2)}
                  </Typography>
                </Typography>
              )}

              {inputSearchContext && (
                <Typography variant="body2" component="div">
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#16a085" }}>
                    Search Context:
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "16px", fontWeight: "500" }}>
                    {inputSearchContext}
                  </Typography>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Dialog>

        <Handle
          type="source"
          position={Position.Left}
          id={`${id}_source`}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          id={`${id}_target_left`}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}_target_right`}
          isConnectable={isConnectable}
        />
      </Box>
    ) : null;
  }
);

export default TextNode;
