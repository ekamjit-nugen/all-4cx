import React from "react";
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from "@mui/material";

const CheckboxGroup = ({ label, options, selectedOptions, onChange }) => {
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: "20px 20px 10px", // Top, right/left, bottom padding
        margin: 2,
        backgroundColor: "#fff", // White background for contrast
      }}
    >
      <Typography
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
      </Typography>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={selectedOptions.includes(option)}
                onChange={onChange}
                name={option}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default CheckboxGroup;
