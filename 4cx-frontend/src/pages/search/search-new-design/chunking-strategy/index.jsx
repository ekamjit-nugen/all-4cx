import { Box, Card, Input, Typography } from "@mui/material";
import SoftInput from "components/soft-input";
import SoftRadioButton from "components/soft-radiobutton";
import SoftSelect from "components/soft-select";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateUnSaveChanges } from "store/features/searchSlice";
import { updateChunkStrategy } from "store/features/searchSlice";

const categoryOptions = [
  { id: 0, value: "PDF", label: "PDF" },
  { id: 1, value: "CSV", label: "CSV" },
  { id: 2, value: "HTML", label: "HTML" },
];

const chunkingStrategyData = {
  pdf: {
    data: {
      title: "Chunk by Page",
      subTitle: "Chunk document by page range",
      inputTitle: "Specify page range that each document will be split into",
      inputPlaceholder: "Pages 1-12..",
      inputDefault: "Each page will be treated as a single chunk",
    },
    options: [
      { id: 0, value: "Chunk by Page", label: "Chunk by Page" },
      {
        id: 1,
        value: "Chunk by Sections (Heading-Based)",
        label: "Chunk by Sections (Heading-Based)",
      },
      { id: 2, value: "Chunk by Paragraph", label: "Chunk by Paragraph" },
      { id: 3, value: "Multimodal Chunking", label: "Multimodal Chunking" },
      {
        id: 4,
        value: "Chunk by Entities (and surrounding text)",
        label: "Chunk by Entities (and surrounding text)",
      },
      { id: 5, value: "Sliding Window Chunking", label: "Sliding Window Chunking" },
      { id: 6, value: "Automatic Chunking ", label: "Automatic Chunking " },
    ],
  },
  csv: {
    data: {
      title: "Chunk by Rows",
      subTitle: "Treat each row as a chunk",
      inputTitle: "Specify the number of rows to group together per chunk",
      inputPlaceholder: "E.g. 10",
      inputDefault: "Each chunk will contain one row",
    },
    options: [
      { id: 0, value: "Chunk by Rows", label: "Chunk by Rows" },
      { id: 1, value: "Chunk by Columns", label: "Chunk by Columns" },
      { id: 2, value: "Chunk by Key(e.g. Primary Key)", label: "Chunk by Key(e.g. Primary Key)" },
      { id: 3, value: "Chunk by Value Range", label: "Chunk by Value Range" },
      {
        id: 4,
        value: "Chunk by Entities (and associated rows)",
        label: "Chunk by Entities (and associated rows)",
      },
      {
        id: 5,
        value: "Chunk by Time-Series Sliding Window",
        label: "Chunk by Time-Series Sliding Window",
      },
      { id: 6, value: "Automatic Chunking ", label: "Automatic Chunking " },
    ],
  },
  html: {
    data: {
      title: "Chunk by Rows",
      subTitle: "Treat each row as a chunk",
      inputTitle: "Specify the number of rows to group together per chunk",
      inputPlaceholder: "Please Select HTML element",
      inputDefault: "Each chunk will be a <p> paragraph",
    },
    options: [
      { id: 0, value: "Chunk by HTML Element", label: "Chunk by HTML Element" },
      { id: 1, value: "Chunk by Headers", label: "Chunk by Headers" },
      { id: 2, value: "Chunk by Lists", label: "Chunk by Lists" },
      { id: 3, value: "Chunk by Metadata", label: "Chunk by Metadata" },
      { id: 4, value: "Multimodal Chunking", label: "Multimodal Chunking" },
      { id: 5, value: "Automatic Chunking ", label: "Automatic Chunking " },
    ],
  },
};

export default function ChunkingStrategy() {
  const searchRedux = useSelector((state) => state.searchFlow.flowJsonData);
  const optionArray = searchRedux["Chunking_Strategy"]?.selectedOptionArray;
  const [selectedCategory, setSelectedCategory] = useState(optionArray?.[0]?.category?.id);
  const createNewSearch = useSelector((state) => state.searchFlow.createNew);
  const createNewRetrieval = useSelector((state) => state.retrieval.createNew);
  const [selectedOption, setSelectedOption] = useState();
  const dispatch = useDispatch();
  const [temp, setTemp] = useState();
  const [selectedOptionArray, setSelectedOptionArray] = useState([]);
  const [inputValue, setInputValue] = useState(searchRedux?.Chunking_Strategy?.inputValue);
  const [category, setCategory] = useState(searchRedux["Chunking_Strategy"]?.category);
  const [contentDetails, setContentDetails] = useState({
    title: "Chunk by Page",
    subTitle: "Chunk document by page range",
    inputTitle: "Specify page range that each document will be split into",
    inputPlaceholder: "Pages 1-12..",
    inputDefault: "Each page will be treated as a single chunk",
  });

  const [radioButtonOptions, setRadioButtonOption] = useState([
    { id: 0, value: "Chunk by Page", label: "Chunk by Page" },
    {
      id: 1,
      value: "Chunk by Sections (Heading-Based)",
      label: "Chunk by Sections (Heading-Based)",
    },
    { id: 2, value: "Chunk by Paragraph", label: "Chunk by Paragraph" },
    { id: 3, value: "Multimodal Chunking", label: "Multimodal Chunking" },
    {
      id: 4,
      value: "Chunk by Entities (and surrounding text)",
      label: "Chunk by Entities (and surrounding text)",
    },
    { id: 5, value: "Sliding Window Chunking", label: "Sliding Window Chunking" },
    { id: 6, value: "Automatic Chunking ", label: "Automatic Chunking " },
  ]);

  const handleContentOfCategory = (value) => {
    let newOptions = [];
    if (value.value === "PDF") {
      setContentDetails(chunkingStrategyData.pdf.data);
      newOptions = chunkingStrategyData.pdf.options;
    } else if (value.value === "CSV") {
      setContentDetails(chunkingStrategyData.csv.data);
      newOptions = chunkingStrategyData.csv.options;
    } else if (value.value === "HTML") {
      setContentDetails(chunkingStrategyData.html.data);
      newOptions = chunkingStrategyData.html.options;
    }
    setCategory(value);
    setRadioButtonOption(newOptions);
    if (searchRedux?.Chunking_Strategy?.status === false) {
      setSelectedOption(newOptions[0].value);
    }
  };

  const handleCategory = (value) => {
    handleContentOfCategory(value);
    setSelectedCategory(value.id);
    const existingCategoryIndex = optionArray.findIndex(
      (option) => option.category.id === value.id
    );
    let selectedOptions = [...optionArray];
    if (existingCategoryIndex !== undefined && existingCategoryIndex !== -1) {
      // If category exists, update the chunkingType
      selectedOptions[existingCategoryIndex] = {
        ...optionArray[existingCategoryIndex],
        category: value,
      };
    } else {
      // If category does not exist, push a new entry
      selectedOptions.push({
        chunkingType: "",
        category: value,
      });
    }
    const data = {
      ...searchRedux["Chunking_Strategy"],
      selectedOptionArray: selectedOptions,
      status: true,
    };
    dispatch(updateChunkStrategy(data));
  };

  const handleValueSelection = (value) => {
    const existingCategoryIndex = optionArray.findIndex(
      (option) => option.category.id === selectedCategory
    );
    let selectedOptions = [...optionArray];
    if (existingCategoryIndex !== undefined && existingCategoryIndex !== -1) {
      // If category exists, update the chunkingType
      selectedOptions[existingCategoryIndex] = {
        ...optionArray[existingCategoryIndex],
        chunkingType: value,
      };
    } else {
      console.log("Category not selected");
    }
    const data = {
      ...searchRedux["Chunking_Strategy"],
      selectedOptionArray: selectedOptions,
      status: true,
    };
    dispatch(updateChunkStrategy(data));
  };

  const getSelectedValue = () => {
    const existingCategory = optionArray.find((option) => option.category.id === selectedCategory);
    if (existingCategory) {
      return existingCategory.chunkingType;
    }
    return "";
  };

  const handleValueInput = (value) => {
    const existingCategoryIndex = optionArray.findIndex((option) => option.category.id === selectedCategory);
    let selectedOptions = [...optionArray];
    if (existingCategoryIndex !== undefined && existingCategoryIndex !== -1) {
      // If category exists, update the chunkingType
      selectedOptions[existingCategoryIndex] = {
        ...optionArray[existingCategoryIndex],
        inputValue: value,
      };
    } else {
      console.log("Category not selected");
    }
    const data = {
      ...searchRedux["Chunking_Strategy"],
      selectedOptionArray: selectedOptions,
      status: true,
    };
    dispatch(updateChunkStrategy(data));
  }

  const getInputValue = () => {
    const existingCategory = optionArray.find((option) => option.category.id === selectedCategory);
    if (existingCategory) {
      return existingCategory.inputValue;
    }
    return "";
  };


  useEffect(() => {
    if (searchRedux["Chunking_Strategy"]?.category) {
      handleCategory(searchRedux["Chunking_Strategy"].category);
    }
  }, [searchRedux["Chunking_Strategy"]?.category?.value]);

  return (
    <Box
      sx={{
        gap: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: 50,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "60%",
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: "700" }}>Choose Chunking Strategy</Typography>
          <Typography sx={{ fontSize: 12, color: "gray" }}>
            Select the chunking strategy you want to adopt
          </Typography>
        </Box>

        <Box sx={{ width: 200 }}>
          <SoftSelect
            defaultValue={optionArray?.[0]?.category}
            options={categoryOptions}
            onChange={handleCategory}
          />
        </Box>
      </Box>

      {/* Content */}
      <Card sx={{ width: "90%" }}>
        <Box sx={{ display: "flex", padding: 6 }}>
          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography variant="h5">Chunking Type</Typography>

            <SoftRadioButton
              options={radioButtonOptions}
              selectedValue={getSelectedValue()}
              onChange={handleValueSelection}
            />
          </Box>

          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 6 }}>
            <Box>
              <Typography variant="h5">{contentDetails.title}</Typography>
              <Typography variant="subtitle2">{contentDetails.subTitle}</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="caption">{contentDetails.inputTitle}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: 400 }}>
                <SoftInput
                  sx={{
                    "& .MuiInputBase-input": {
                      width: "100% !important",
                    },
                  }}
                  value={getInputValue() || ""}
                  placeholder={contentDetails.inputPlaceholder}
                  onChange={(e) => handleValueInput(e.target.value)}
                />
                <Box
                  sx={{
                    paddingY: 1,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    color: "gray",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "black !important" }}>
                    Default:
                  </Typography>
                  <Typography variant="caption">{contentDetails.inputDefault}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
