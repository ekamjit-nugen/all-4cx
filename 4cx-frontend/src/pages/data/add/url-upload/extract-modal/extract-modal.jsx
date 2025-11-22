import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import SoftButton from "components/soft-button";

const ExtractModal = ({ open, onClose, url, urlCount, onUpload }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: "10px",
      }}
    >
      <Typography id="modal-title" variant="h6" component="h2">
        Confirm Extraction
      </Typography>
      <Typography id="modal-title" variant="h6" component="h2" sx={{ mt: 2, fontSize: "15px" }}>
        Are you sure you want to extract data from the entered URL?
      </Typography>
      <FormField type="text" label="URL" placeholder="Enter URL" value={url} disabled />
      <Typography sx={{ mt: 2, fontSize: "15px", fontWeight: "500" }}>
        Total URLs: {urlCount}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <SoftButton onClick={onClose} variant="outlined" color="dark" sx={{ mr: 1 }}>
          Cancel
        </SoftButton>
        <SoftButton onClick={onUpload} variant="gradient" color="dark">
          Upload
        </SoftButton>
      </Box>
    </Box>
  </Modal>
);

export default ExtractModal;
