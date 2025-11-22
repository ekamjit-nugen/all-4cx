import { Box, Typography } from "@mui/material";
import React from "react";

export default function PromptArchivedSection() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: "start",
        paddingLeft: "60px",
      }}
    >
      <Typography>Archived Page</Typography>
    </Box>
  );
}
