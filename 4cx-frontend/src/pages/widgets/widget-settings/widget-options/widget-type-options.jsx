import React from "react";
import { Box, Radio, FormControlLabel, FormGroup, RadioGroup } from "@mui/material";
import SoftTypography from "components/soft-typography";

const WidgetTypeOptions = ({ label, options, selectedOptions, onChange }) => {
  return (
    <Box
      sx={{
        width: "70%",
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: "20px 20px 10px", // Top, right/left, bottom padding
        backgroundColor: "#fff", // White background for contrast
      }}
    >
      <SoftTypography
        variant="h6"
        sx={{
          position: "absolute",
          top: -12,
          left: 16,
          backgroundColor: "#fff", // Match the container's background
          padding: "0 4px", // Small padding around the label
          color: "#333", // Color for the label
          fontWeight: "bold",
        }}
      >
        {label}
      </SoftTypography>
      <RadioGroup value={selectedOptions} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default WidgetTypeOptions;
