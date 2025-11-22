import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import SoftButton from "components/soft-button";
import SoftInput from "components/soft-input";
import SoftTypography from "components/soft-typography";
import SoftSelect from "components/soft-select";
import SoftBox from "components/soft-box";
import SoftTextArea from "components/soft-textarea";

const categoryOptions = [
  {
    label: "String",
    value: "string",
  },
  {
    label: "Array",
    value: "array",
  },
  {
    // id:2,
    label: "JSON",
    value: "json",
  },
];

export default function CustomAddColumnModal({
  formData,
  open,
  onClose,
  handleInputFieldChange,
  handleSelectChange,
  handleModalSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h4" fontWeight="bold">
          Add New Field
        </Typography>
      </DialogTitle>
      <DialogContent>
        <SoftBox display="flex" flexDirection="column" gap={2}>
          {/* Name Field */}
          <Typography variant="subtitle2">Please fill in the required fields.</Typography>
          <SoftTypography variant="subtitle2">Name</SoftTypography>
          <SoftInput
            placeholder="Enter the name "
            variant="outlined"
            name="name"
            value={formData?.name}
            onChange={handleInputFieldChange}
            fullWidth
            InputLabelProps={{
              style: { fontSize: "14px" }, // modern input style
            }}
            InputProps={{
              style: { fontSize: "16px", padding: "12px" }, // modern input style
            }}
          />

          {/* Origin Field */}
          <SoftTypography variant="subtitle2">Origin</SoftTypography>
          <SoftSelect
            name="origin"
            defaultValue={formData?.origin}
            options={categoryOptions}
            onChange={handleSelectChange}
            fullWidth
            InputLabelProps={{
              style: { fontSize: "14px" },
            }}
            InputProps={{
              style: { fontSize: "16px", padding: "12px" },
            }}
          />

          {/* Description Field */}
          <SoftTypography variant="subtitle2">Description</SoftTypography>
          <SoftTextArea
            placeholder="Enter the name "
            variant="outlined"
            name="description"
            value={formData?.description}
            onChange={handleInputFieldChange}
            multiline
            rows={3}
            fullWidth
            InputLabelProps={{
              style: { fontSize: "14px" }, // modern input style
            }}
            InputProps={{
              style: { fontSize: "16px", padding: "12px" }, // modern input style
            }}
          />
        </SoftBox>
      </DialogContent>

      <DialogActions>
        <SoftButton style={{ width: 100 }} variant="gradient" color="light" onClick={onClose}>
          Cancel
        </SoftButton>
        <SoftButton
          style={{ width: 100 }}
          variant="gradient"
          color="dark"
          onClick={handleModalSubmit}
        >
          Save
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
}
