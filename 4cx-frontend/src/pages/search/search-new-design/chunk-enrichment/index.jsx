import { Box, Card, List, ListItem, Typography } from "@mui/material";
import SoftCheckBox from "components/soft-checkbox";
import SoftRadioButton from "components/soft-radiobutton";
import SoftSelect from "components/soft-select";
import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateUnSaveChanges } from "store/features/searchSlice";
import { updateChunkEnrichment } from "store/features/searchSlice";

export default function ChunkingEnrichment() {
  const [temp, setTemp] = useState(null);
  const searchRedux = useSelector((state) => state.searchFlow.flowJsonData);
  const [selectedOptions, setSelectedOptions] = useState(
    searchRedux["Chunk_Enrichment"]?.selectedOptions || []
  );
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchRedux["Chunk_Enrichment"]?.selectedLanguage || ""
  );
  const [radioButtonOptions, setRadioButtonOption] = useState([
    {
      id: 0,
      value: "Extract affirmative and factual statements",
      label: "Extract affirmative and factual statements",
    },
    {
      id: 1,
      value: "Extract action items",
      label: "Extract action items",
    },
    {
      id: 2,
      value: "Extract entities with descriptions",
      label: "Extract entities with descriptions",
    },
    {
      id: 3,
      value: "Translate to Language",
      label: "Translate to Language",
    },
    {
      id: 4,
      value: "Extract Key Phrases",
      label: "Extract Key Phrases",
    },
    {
      id: 5,
      value: "Extract Graph Representation",
      label: "Extract Graph Representation",
    },
    {
      id: 6,
      value: "Automatic Enrichment ",
      label: "Automatic Enrichment ",
    },
  ]);

  const items = [
    { id: 1, title: "Legal documents: ", subTitle: "To extract legally binding statements" },
    { id: 2, title: "Scientific papers: ", subTitle: "To pull out key findings or claims" },
    {
      id: 3,
      title: "News Articles: ",
      subTitle: "To focus on fact-based reporting and filter out opinions or conjecture",
    },
  ];

  const isValid = isEqual(temp, selectedOptions);

  // useEffect(() => {
  //   if (temp?.length) {
  //     dispatch(updateUnSaveChanges(!isValid));
  //   }
  // }, [isValid]);

  useEffect(() => {
    const data = {
      selectedOptions,
      status: selectedOptions?.length > 0 ? true : false,
    };

    if (!temp) {
      setTemp(selectedOptions);
    }

    dispatch(updateChunkEnrichment(data));
  }, [selectedOptions, selectedLanguage]);

  return (
    <Box
      sx={{
        gap: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        <Box
          sx={{
            width: "60%",
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: "700" }}>Apply Flow</Typography>
          <Typography sx={{ fontSize: 12, color: "gray" }}>
            Select Large Language Modal Prompt
          </Typography>
        </Box>
      </Box>

      {/* Content */}

      <Card sx={{ width: "90%" }}>
        <Box sx={{ display: "flex", padding: 6 }}>
          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 4 }}>
            <Typography sx={{ fontSize: 20, fontWeight: "500" }}>Chunking Type</Typography>

            {/* <SoftRadioButton
              options={radioButtonOptions}
              selectedValue={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            /> */}
            <SoftCheckBox
              options={radioButtonOptions}
              selectedValue={selectedOptions}
              onChange={(value) => {
                setSelectedOptions(value);
              }}
              optionStyle={{
                backgroundColor: "transparent",
              }}
            />
          </Box>

          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 5 }}>
            {selectedOptions.includes("Extract affirmative and factual statements") &&
              !selectedOptions.includes("Translate to Language") && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <Typography sx={{ fontWeight: "500" }}>
                    Extract affirmative and factual statements
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, color: "gray" }}>
                    <Typography sx={{ fontSize: 14 }}>
                      These are statements that make a clear assertion or claim, typically expressed
                      with confidence and often in the present or past tense
                    </Typography>
                    <Typography
                      sx={{
                        gap: 1,
                        fontSize: 14,
                        display: "flex",
                      }}
                    >
                      <Typography sx={{ fontWeight: "500", fontSize: 15 }}>Example:</Typography>{" "}
                      &quot;The sky is blue,&quot; or &quot;The company reported a 20% increase in
                      revenue last quarter.&quot;
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      This type of chunk enrichment is useful for summarising key facts, identifying
                      declarative knowledge, and filtering out less important or speculative
                      information like opinions or questions. It can be applied in contexts such as
                    </Typography>

                    <Typography>
                      <List>
                        {items.map((item) => (
                          <ListItem
                            key={item.id}
                            sx={{ display: "flex", gap: 1, alignItems: "center" }}
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 500,
                                fontSize: 12,
                              }}
                            >
                              {`• ${item.title}`}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}>{item.subTitle}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Typography>
                  </Box>
                </Box>
              )}

            {selectedOptions.includes("Translate to Language") && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ fontSize: 14, color: "gray" }}>
                  Choose the language you want to translate the chunk to:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: 500 }}>
                  <SoftSelect
                    options={[
                      { id: 0, value: "Option 1", label: "Option 1" },
                      { id: 1, value: "Option 2", label: "Option 2" },
                    ]}
                    placeholder="Select Language"
                    defaultValue={selectedLanguage}
                    onChange={(value) => setSelectedLanguage(value)}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
