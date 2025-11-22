import { Box, Typography } from "@mui/material";
import React from "react";
import DataTable from "./table";
import SoftInput from "components/soft-input";

export default function SelectDataSource({ isLoading }) {
  return (
    <Box
      sx={{
        gap: 5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 50,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "60%" }}>
          <Typography sx={{ fontSize: 22, fontWeight: "700" }}>Select Data Source(S)</Typography>
          <Typography sx={{ fontSize: 12, color: "gray" }}>Choose data source to index</Typography>
        </Box>

        <Box sx={{ width: "40%" }}>
          <SoftInput
            placeholder="Search here..."
            icon={{ component: "search", direction: "left" }}
          />
        </Box>
      </Box>

      <DataTable isLoading={isLoading} />
    </Box>
  );
}
