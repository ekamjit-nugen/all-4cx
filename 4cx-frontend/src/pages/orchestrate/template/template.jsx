import { Box, Card, Typography } from "@mui/material";
import React from "react";
 
import SoftBox from "components/soft-box";

function OrchestrateTemplate() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "white",
          alignItems: "centre",
          textAlign: "center",
          padding: "50px",
          borderRadius: "10px",
        }}
      >
        Template text goes here
      </Box>
      <SoftBox pt={3}>
        <SoftBox>
          <Card sx={{ height: "auto" }}></Card>
        </SoftBox>
      </SoftBox>
    </>
  );
}
export default OrchestrateTemplate;
