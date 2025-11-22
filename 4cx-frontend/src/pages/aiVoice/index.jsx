import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Card, TextField } from "@mui/material";
import promptApi from "@/api/prompt";
import { useSelector } from "react-redux";
import PromptTypeTab from "pages/prompts/prompt-flow/modules/tabs/prompt-type-tabs";
import AiPromptList from "./AiPromptList";


const category = [
  { label: "ai", year: 1994 },
  { label: "machine learning", year: 1972 },
  { label: "web development", year: 1974 },
  { label: "data science", year: 2008 },
  { label: "deep learning", year: 1957 },
  { label: "data warehousing", year: 1993 },
  { label: "operating system", year: 1994 },
];

const AiNewPage = () => {
  const [promptType, setPromptType] = useState("project");
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All",
    value: "All",
  });

  const handleChangePromptType = (newSourceType) => {
    setPromptType(newSourceType);
    setSelectedCategory({
      label: "All",
      value: "All",
    });
  };

  const handleAdd = () => {
    setAddPrompt(!addPrompt);
  };
  const projectId = useSelector((state) => state.projectIdList);
  const [categoryOption, setCategoryOption] = useState([]);

  async function fetchCategoryData(value) {
    if (promptType === "organisation") {
      const data = await promptApi.getCategoryDataOrgAi(
        value?.orgId,
        value?.projectId,
        value?.userId,
        true
      );
      const response = data?.data?.category;
      const option = response?.map((value) => ({
        label: value?.category,
        value: value?._id,
      }));
      const categoryOptions = [{ label: "All", value: "All" }];
      const options = categoryOptions.concat(option);
      setCategoryOption(options);
    } else {
      const data = await promptApi.getCategoryDataAi(value?.orgId, value?.projectId, value?.userId);
      const response = data?.data?.category;
      const option = response?.map((value) => ({
        label: value?.category,
        value: value?._id,
      }));
      const categoryOptions = [{ label: "All", value: "All" }];
      const options = categoryOptions.concat(option);
      setCategoryOption(options);
    }
  }
  useEffect(() => {
    try {
      if (projectId?.orgId && projectId?.projectId) {
        fetchCategoryData(projectId);
      }
    } catch (error) {
      console.error(error, "error");
    }
  }, [projectId, promptType]);

  return (
    <Card sx={{ paddingY: 4 }}>
      <Box
        sx={{
          paddingRight: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PromptTypeTab promptType={promptType} onChange={handleChangePromptType} />
        {promptType !== "archived" && (
          <Autocomplete
            disablePortal
            options={categoryOption}
            value={selectedCategory?.label}
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
            onChange={(event, value) => {
              setSelectedCategory({ value: value?.value, label: value?.label });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
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
        )}
      </Box>

      <Box>
        <AiPromptList
          onChange={handleAdd}
          promptType={promptType}
          promptId={selectedCategory?.value}
        />
      </Box>
    </Card>
  );
};

export default AiNewPage;
