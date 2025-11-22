import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function ChatHistory({ isConnectable, onRemoveNode, onUpdateChatData }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isJSONValid, setIsJSONValid] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const reduxChatData = useSelector((state) => state.chat.chatData);
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    if (openModal) {
      setEditorContent(JSON.stringify(reduxChatData, null, 2));
      setError("");
      setSuccess("");
      setIsJSONValid(true);
    }
  }, [openModal, reduxChatData]);

  const handleClose = () => {
    onRemoveNode();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    if (isJSONValid && editorContent) {
      try {
        const parsedData = JSON.parse(editorContent);
        onUpdateChatData(parsedData);
        setOpenModal(false);
        setSuccess("Chat history updated successfully.");
      } catch (error) {
        setError("Invalid JSON format. Please correct the input.");
      }
    }
  };

  const validateJSON = (content) => {
    try {
      JSON.parse(content);
      setError("");
      setSuccess("Valid JSON!");
      setIsJSONValid(true);
    } catch {
      setError("Invalid JSON format. Please correct the input.");
      setSuccess("");
      setIsJSONValid(false);
    }
  };

  const handleViewModal = () => {
    setIsView(true);
    handleOpenModal();
  };

  return (
    <Box
      sx={{
        padding: "4px 4px",
        border: "2px solid #333a63",
        borderRadius: 2,
        width: 150,
        background: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MoreHorizIcon sx={{ height: "8px", width: "8px", color: "gray" }} />
      </Box>
      <Box sx={{ display: "grid", alignItems: "start" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontSize: "10px", fontWeight: "700" }}>Chat History</Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(51, 58, 99, 0.2)",
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
                stroke: "#333a63",
                strokeWidth: 1,
                backgroundColor: "none",
              }}
            />
          </IconButton>
        </Box>

        {reduxChatData?.length > 0 && (
          <Box
            sx={{ paddingBottom: 1, paddingX: 1, "&:hover": { color: "blue", cursor: "pointer" } }}
            onClick={handleViewModal}
          >
            <Typography sx={{ fontSize: 10 }}>
              Question: {reduxChatData?.[0]?.inputs?.question?.slice(0, 10)} ....
            </Typography>
            <Typography sx={{ fontSize: 10 }}>
              Response: {reduxChatData?.[1]?.outputs?.answer?.slice(0, 10)} ....
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
          <Button
            onClick={handleOpenModal}
            size="small"
            sx={{
              border: "1px solid #333a63",
              borderRadius: 1,
              fontSize: "8px",
              color: "#333a63",
              padding: "3px 3px",
              "&:hover": {
                backgroundColor: "rgba(51, 58, 99, 0.2)",
                color: "#333a63",
              },
            }}
          >
            Add Chat
          </Button>
        </Box>
      </Box>
      <Handle position={Position.Right} isConnectable={isConnectable} />

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>{isView ? "View Chat History" : "Edit Chat History"}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            multiline
            fullWidth
            value={editorContent}
            onChange={(e) => {
              setEditorContent(e.target.value);
              validateJSON(e.target.value);
            }}
            placeholder="Add chat history here"
            sx={{
              fontSize: "14px !important",
              "& .MuiInputBase-input": {
                fontSize: "14px !important",
                overflowY: "auto !important",
                wordBreak: "break-word",
                width: "100% !important",
                height: "400px !important",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
              "& .MuiInputBase-root": {
                padding: "10px !important",
              },
              "& .MuiOutlinedInput-root": {
                padding: "10px !important",
                height: "200px",
                overflowY: "auto",
              },
              "& .MuiFormControl-root": {
                marginBottom: "16px",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            size="small"
            color="primary"
            sx={{
              borderRadius: 2,
              padding: "6px 12px",
              fontSize: "12px",
              color: "#f5f5f5",
              backgroundColor: "#333333",
              "&:hover": {
                backgroundColor: "#4f4f4f",
                color: "#e0e0e0",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Cancel
          </Button>
          {!isView && (
            <Button
              onClick={handleSave}
              size="small"
              color="primary"
              disabled={!isJSONValid}
              sx={{
                borderRadius: 2,
                padding: "6px 12px",
                fontSize: "12px",
                color: "#fafafa",
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#388e3c",
                  color: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#d0d0d0",
                  color: "#a0a0a0",
                },
              }}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChatHistory;
