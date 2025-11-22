import { Box, styled, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckboxGroup from "./group-checkbox";
import { useDispatch } from "react-redux";
import { updateChooseRetrievalStrategy } from "store/features/retrievalSlice";
import { useSelector } from "react-redux";
import { updateRetrievalUnSaveChanges } from "store/features/retrievalSlice";
import { isEqual } from "lodash";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInput-underline:before": {
    borderBottom: "none", // Removes the default underline before focus
  },
  "& .MuiInput-underline:after": {
    borderBottom: "none", // Removes the default underline after focus
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none", // Prevent underline on hover
  },
  "& .MuiInputBase-root": {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#f0f0f0", // Example custom background
    color: theme.palette.text.primary, // Example custom text color
  },
  "& input[type=number]": {
    "-moz-appearance": "textfield", // Firefox: Hides the spin buttons
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none", // Chrome, Safari, Edge: Hides the spin buttons
      margin: 0, // Removes default margin in WebKit browsers
    },
  },
  "& .MuiInputBase-input": {
    width: "100% !important",
  },
  ".custom-input": {
    marginTop: 10 /* Adjust as needed */,
  },
}));

export default function RetrievalStrategyComponent() {
  const reduxData = useSelector(
    (state) => state.retrieval?.retrievalFlowsJson?.choose_retrieval_strategy?.data
  );
  const [temp, setTemp] = useState();
  const [aiEnhancementOptions, setAiEnhancementOptions] = useState(
    reduxData?.aiEnhancementOptions || []
  );
  const [retrievalOptions, setRetrievalOptions] = useState(reduxData?.retrievalOptions || []);
  const [prefix, setPrefix] = useState(reduxData?.prefix || "");
  const [suffix, setSuffix] = useState(reduxData?.suffix || "");
  const [characterLimit, setCharacterLimit] = useState(reduxData?.characterLimit);
  const [inputQuery, setInputQuery] = useState(reduxData?.inputQuery || "");
  const [regexType, setRegexType] = useState(reduxData?.regexType || "");
  const [showOutput, setShowOutput] = useState(reduxData?.showOutput || "Let's Start ....");
  const dispatch = useDispatch();

  const convertInput = (input) => {
    let convertedData = "";
    let selectedPattern;

    try {
      selectedPattern = new RegExp(regexType.trim());
    } catch (e) {
      console.error("Invalid regex:", e);
      return input; // Fallback to original input
    }

    for (let char of input) {
      if (char === " ") {
        convertedData += " ";
      } else if (selectedPattern.test(char)) {
        convertedData += char;
      }
    }

    return convertedData;
  };

  useEffect(() => {
    const combinedInput = `${prefix} ${inputQuery} ${suffix}`.trim();
    const convertedData = convertInput(combinedInput).trim();
    setShowOutput(convertedData.slice(0, characterLimit || convertedData.length));
  }, [prefix, suffix, inputQuery, characterLimit, regexType]);

  const reduxDataCheck = {
    prefix,
    suffix,
    characterLimit,
    regexType,
    inputQuery,
    showOutput,
  };

  const isValid = isEqual(temp, reduxDataCheck);

  // useEffect(() => {
  //   if (temp) {
  //     dispatch(updateRetrievalUnSaveChanges(!isValid));
  //   }
  // }, [isValid]);

  useEffect(() => {
    const data = {
      prefix,
      suffix,
      characterLimit,
      regexType,
      inputQuery,
      showOutput,
      aiEnhancementOptions,
      retrievalOptions,
    };

    if (!temp) {
      setTemp(data);
    }
    if (
      data.prefix != "" ||
      data.suffix != "" ||
      data.characterLimit != "" ||
      data.regexType != "" ||
      data.inputQuery != "" ||
      data.showOutput != ""
    ) {
      const updatedData = {
        data,
        status: true,
      };
      dispatch(updateChooseRetrievalStrategy(updatedData));
    } else if (
      data.prefix === "" &&
      data.suffix === "" &&
      data.characterLimit === "" &&
      data.regexType === "" &&
      data.inputQuery === "" &&
      data.showOutput === ""
    ) {
      const updatedData = {
        data,
        status: false,
      };
      dispatch(updateChooseRetrievalStrategy(updatedData));
    }
  }, [inputQuery, characterLimit, regexType, showOutput, aiEnhancementOptions, retrievalOptions]);

  const handleAIEnhacementCheckboxChange = (event) => {
    const { name } = event.target;

    setAiEnhancementOptions((prev) =>
      prev.includes(name) ? prev.filter((option) => option !== name) : [...prev, name]
    );
  };

  const handleRetrievalOptionsCheckboxChange = (event) => {
    const { name } = event.target;

    setRetrievalOptions((prev) =>
      prev.includes(name) ? prev.filter((option) => option !== name) : [...prev, name]
    );
  };

  const options = ["Option 1", "Option 2", "Option 3"];
  return (
    <Box
      sx={{
        gap: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          flex: 1,
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 2 }}>
          <CustomTextField
            id="standard-number"
            label="Add Prefix"
            type="text"
            InputLabelProps={{
              shrink: true,
              style: {
                marginTop: -10,
              },
            }}
            defaultValue={prefix}
            variant="standard"
            placeholder="Iphone"
            onChange={(value) => setPrefix(value.target.value)}
          />
          <CustomTextField
            id="standard-number"
            label="Add Suffix"
            type="text"
            InputLabelProps={{
              shrink: true,
              style: {
                marginTop: -10,
              },
            }}
            defaultValue={suffix}
            variant="standard"
            placeholder="Buy"
            onChange={(value) => setSuffix(value.target.value)}
          />
          <CustomTextField
            id="standard-number"
            label="Limit number of character"
            type="number"
            InputLabelProps={{
              shrink: true,
              style: {
                marginTop: -10,
              },
            }}
            defaultValue={characterLimit}
            variant="standard"
            placeholder="0-200"
            onChange={(value) => setCharacterLimit(value.target.value)}
          />
          <CustomTextField
            id="standard-number"
            label="Apply Regex"
            type="string"
            InputLabelProps={{
              shrink: true,
              style: {
                marginTop: -10,
              },
            }}
            defaultValue={regexType}
            variant="standard"
            onChange={(value) => setRegexType(value.target.value)}
          />
          <CustomTextField
            id="standard-number"
            label="Number chunks to return"
            type="number"
            InputLabelProps={{
              shrink: true,
              style: {
                marginTop: -10,
              },
            }}
            defaultValue={""}
            variant="standard"
          />
        </Box>
        <Box sx={{ display: "flex", paddingX: 10, paddingY: 2, flexDirection: "column" }}>
          <>
            <CustomTextField
              id="standard-number"
              type="text"
              label="Input Query"
              InputLabelProps={{
                shrink: true,
                style: {
                  marginTop: -10,
                },
              }}
              defaultValue={inputQuery}
              variant="standard"
              onChange={(value) => setInputQuery(value.target.value)}
            />
          </>
          <Box
            sx={{
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ marginTop: 4 }} variant="h6">
              Input Query
            </Typography>
            <Box
              height={"100%"}
              sx={{ backgroundColor: "#f5f5f5", height: 100, padding: 2, borderRadius: 4 }}
            >
              <Typography sx={{ fontSize: 14 }}>{showOutput}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
          <CheckboxGroup
            label="AI Enhacements"
            options={options}
            selectedOptions={aiEnhancementOptions}
            onChange={handleAIEnhacementCheckboxChange}
          />
          <CheckboxGroup
            label="Retrieval Options"
            options={options}
            selectedOptions={retrievalOptions}
            onChange={handleRetrievalOptionsCheckboxChange}
          />
        </Box>
      </Box>
    </Box>
  );
}
