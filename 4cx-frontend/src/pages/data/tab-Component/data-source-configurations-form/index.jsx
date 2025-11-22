import { Box, Switch, Typography } from "@mui/material";
import SoftBox from "components/soft-box";
import SoftButton from "components/soft-button";
import SoftInput from "components/soft-input";
import SoftTextArea from "components/soft-textarea";
import SoftTypography from "components/soft-typography";
import { Save } from "lucide-react";
import React from "react";

const DataSourceConfigurationsForm = ({ formSchema, formData, handleSubmit, handleChange }) => {
  const renderInputField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <SoftInput
            name={field.name}
            placeholder={field.placeholder}
            size="large"
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      case "textarea":
        return (
          <SoftTextArea
            name={field.name}
            placeholder={field.placeholder}
            size="large"
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      case "switch":
        return (
          <Switch
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
          />
        );
      case "password":
        return (
          <SoftInput
            name={field.name}
            type="password"
            placeholder={field.placeholder}
            size="large"
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };
  return (
    <SoftBox
      height={"fit-content"}
      borderLeft={1}
      borderColor={"grey.400"}
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
      py={2}
      px={4}
    >
      <form style={{ width: "100%" }} onSubmit={handleSubmit} autoComplete="off">
        <Box
          width={"100%"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <SoftTypography sx={{ fontWeight: "bold" }}>Data Source Configurations</SoftTypography>
          <SoftButton type="submit" size="medium" variant={"gradient"} color={"dark"}>
            <Save size={20} style={{ marginRight: 8 }} />
            Save Configurations
          </SoftButton>
        </Box>
        <Box width={"100%"} gap={2} py={2} flex={2} display="flex" flexDirection="column">
          {formSchema?.fields?.map((field) => (
            <Box key={field.name}>
              <Typography variant="h6">
                {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
              </Typography>
              {renderInputField(field)}
            </Box>
          ))}
        </Box>
      </form>
    </SoftBox>
  );
};

export default DataSourceConfigurationsForm;
