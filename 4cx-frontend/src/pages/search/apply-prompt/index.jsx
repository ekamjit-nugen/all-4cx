import { Autocomplete, Box, TextField, useMediaQuery } from "@mui/material";
import SoftTypography from "components/soft-typography";
import MaxHeightTextarea from "components/text-area";
import React, { useState } from "react";

function ApplyPrompt() {
  const [prompt, setPrompt] = useState([]);
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "0 1rem",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ width: "50%" }}>
          <SoftTypography sx={{ fontWeight: "bold" }}>Apply Prompts</SoftTypography>
          <SoftTypography
            sx={{ fontWeight: "semibold", fontSize: "14px", color: "rgb(148 163 184)" }}
          >
            Select Large Language Model Prompt
          </SoftTypography>
        </Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={prompt}
          sx={{ width: isMediumScreen ? "150px" : "250px", height: "80px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ padding: "10px" }}
              size="normal"
              label="Prompt"
              InputLabelProps={{ sx: { fontSize: "14px", textAlign: "center" } }}
            />
          )}
        />
      </Box>
      <Box sx={{ paddingTop: "1rem" }}>
        <MaxHeightTextarea
          //   onEditClick={handleEditClick}
          title="Product Prompt"
          maxRows={4}
          aria-label="maximum height"
          placeholder="Enter Text"
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </Box>
    </Box>
  );
}

export default ApplyPrompt;
