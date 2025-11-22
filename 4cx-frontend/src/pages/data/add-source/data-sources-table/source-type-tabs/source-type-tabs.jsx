import { Tab, Tabs } from "@mui/material";
import React from "react";

export default function SourceTypeTabs({ dataType, sourceType, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Tabs
      sx={{
        width: "60%",
        margin: "20px 0px",
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
      }}
      value={sourceType}
      onChange={handleChange}
      aria-label="Source Type Tabs"
    >
      <Tab sx={{ fontSize: "13px" }} label="Generic" value="generic" />
      <Tab sx={{ fontSize: "13px" }} label="CRM" value="crm" />
      <Tab sx={{ fontSize: "13px" }} label="Local" value="local" />
      <Tab sx={{ fontSize: "13px" }} label="Website" value="website" />
    </Tabs>
  );
}
