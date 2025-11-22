import { Box, useMediaQuery } from "@mui/material";
import SoftTypography from "components/soft-typography";
import React from "react";

function Final() {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <SoftTypography sx={{ fontWeight: "bold", fontSize: isMediumScreen ? "20px" : "40px" }}>
          Congratulations!
        </SoftTypography>
        <SoftTypography
          sx={{ fontWeight: "semibold", fontSize: "14px", color: "rgb(148 163 184)" }}
        >
          You have successfully created your new Gen AI Search
        </SoftTypography>
      </Box>
    </Box>
  );
}

export default Final;
