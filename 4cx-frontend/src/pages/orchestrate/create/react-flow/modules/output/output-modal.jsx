import React from "react";
import { Modal, Box, Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OutputModal = ({ open, handleClose, data }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="output-modal-title"
      aria-describedby="output-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 0,
          overflow: "hidden",
          maxHeight: "80vh",
          borderRadius: "10px",
        }}
      >
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              display="flex"
              alignItems="center"
              id="output-modal-title"
              variant="h6"
              component="h2"
            >
              Output Data
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "50%",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            id="output-modal-description"
            sx={{
              overflowY: "auto",
              maxHeight: "60vh",
              p: 2,
              borderRadius: 1,
              bgcolor: "background.default",
              wordBreak: "break-word",
              border: "1px solid #ddd",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <pre
              style={{
                fontSize: "14px",
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
              }}
            >
              {JSON.stringify(data, null, 1)}
            </pre>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default OutputModal;
