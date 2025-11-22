import { Autocomplete, Box, Card, TextField } from "@mui/material";
import React, { useState } from "react";
import FlowListing from "./flow-listing";
import FlowTypeTab from "./tabs";

const category = [
  { label: "ai", year: 1994 },
  { label: "machine learning", year: 1972 },
  { label: "web development", year: 1974 },
  { label: "data science", year: 2008 },
  { label: "deep learning", year: 1957 },
  { label: "data warehousing", year: 1993 },
  { label: "operating system", year: 1994 },
];

const OrchestrateFlow = () => {
  const [flowType, setFlowType] = useState("flow-list");

  const handleChangeFlowType = (newSourceType) => {
    setFlowType(newSourceType);
  };

  return (
    <Card sx={{ height: "auto", pb: 3 }}>
      <Box
        sx={{
          paddingRight: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FlowTypeTab flowType={flowType} onChange={handleChangeFlowType} />
        <Autocomplete
          disablePortal
          options={category}
          disableClearable
          sx={{
            "& .MuiAutocomplete-input": {
              fontSize: "16px",
            },
            "& .MuiAutocomplete-endAdornment": {
              top: "calc(50% - 10px)",
              // Remove the clear button by hiding the clearIndicator
              ".MuiAutocomplete-clearIndicator": {
                display: "none",
              },
            },
            // Add this to make the component wider
            width: "240px", // Customize the width as needed
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Source Data"
              InputLabelProps={{
                sx: {
                  fontSize: "14px",
                  textAlign: "center",
                  top: "-5px",
                },
              }}
              InputProps={{
                ...params.InputProps,
                sx: {
                  backgroundColor: "lightgray", // Background color of the input field
                  borderRadius: "4px", // Rounded corners for the input
                  width: "100%", // Ensure the input spans the full width of the Autocomplete component
                },
              }}
            />
          )}
        />
      </Box>

      <FlowListing flowType={flowType} />
    </Card>
  );
};

export default OrchestrateFlow;
