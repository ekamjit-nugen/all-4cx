import { Tab, Tabs, useMediaQuery } from "@mui/material";
import React from "react";

export default function PromptTypeTab({ promptType, onChange, archived=true }) {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Tabs
      sx={{
        width: isMediumScreen ? "70%" : "30%",
        margin: "20px 60px",
        display: "flex",
        justifyContent: isMediumScreen ? "center" : "start",
        alignItems: "start",
      }}
      value={promptType}
      onChange={handleChange}
      aria-label="Source Type Tabs"
    >
      <Tab sx={{ fontSize: "13px" }} label="Project" value="project" />
      <Tab sx={{ fontSize: "13px" }} label="Organisation" value="organisation" />
      {archived && <Tab sx={{ fontSize: "13px" }} label="Archived" value="archived" />}
    </Tabs>
  );
}
