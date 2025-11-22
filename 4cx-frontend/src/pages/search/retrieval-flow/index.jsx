import { Autocomplete, Box, Card, CircularProgress, TextField, Typography } from "@mui/material";
import ProgressBar from "components/progress-bar";
import React, { useEffect, useState } from "react";
import StepButton from "../step-button";
import { useSelector } from "react-redux";
import SelectColumnComponent from "./select-column-component";
import ApplyFilterComponent from "./apply-filter-component";
import RetrievalStrategyComponent from "./retrieval-strategy-component";
import fetchData from "services/api";
import { useDispatch } from "react-redux";
import { updateRetrievalFlowName } from "store/features/retrievalSlice";
import { toast } from "react-toastify";
import { updateRetrievalJson } from "store/features/retrievalSlice";
import { updateRetrievalDropDownValue } from "store/features/retrievalSlice";
import { updateSelectColumn } from "store/features/retrievalSlice";
import { updateRetrievalIsLoading } from "store/features/retrievalSlice";
import { updateRetrievalProcess } from "store/features/retrievalSlice";
import { useNavigate } from "react-router-dom";
import { updateRetrievalCallHandleSave } from "store/features/retrievalSlice";
import { updateRetrievalUnSaveChanges } from "store/features/retrievalSlice";
import { isEqual } from "lodash";
import { updateApplyFilter } from "store/features/retrievalSlice";
import { updateUnSaveChanges } from "store/features/searchSlice";

const steps = [
  { label: "Select Columns" },
  { label: "Apply Filters" },
  { label: "Choose Retrieval Strategy" },
];

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
];

export default function Retrieval() {
  const retrievalJson = useSelector((state) => state.retrieval);
  const retrievalUnSaveChanges = useSelector((state) => state.retrieval.unSaveChanges);
  const projectId = useSelector((state) => state.projectIdList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [temp, setTemp] = useState();
  const [saveTriggred, setSaveTriggred] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveAsDraft, setIsSaveAsDraft] = useState(false);
  const [process, setProcess] = useState(0 || retrievalJson?.process);
  const [columnsList, setColumnsList] = useState([
    {
      id: 1,
      name: "Title",
      origin: "string",
      description: "Languages",
      filter: "",
      isSelected: true,
    },
    {
      id: 2,
      name: "Content",
      origin: "array",
      description: "Languages",
      filter: "",
      isSelected: true,
    },
    {
      id: 3,
      name: "Summary",
      origin: "string",
      description: "Languages",
      filter: "",
      isSelected: true,
    },
    {
      id: 4,
      name: "Entities",
      origin: "array",
      description: "Languages",
      filter: "",
      isSelected: true,
    },
    {
      id: 5,
      name: "Keyword",
      origin: "string",
      description: "Languages",
      filter: "",
      isSelected: true,
    },
  ]);
  const [selectedOption, setSelectedOption] = useState([
    {
      label: "No Option",
      value: "No Option",
    },
  ]);

  const createNewSearch = useSelector((state) => state.searchFlow.createNew);
  const createNewRetrieval = useSelector((state) => state.retrieval.createNew);

  const handleNext = () => {
    if (process < 2) {
      setProcess((prevProcess) => prevProcess + 1);
    }
  };

  const handlePrev = () => {
    setProcess((prevProcess) => prevProcess - 1);
  };

  const fetchOption = async () => {
    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "GET"
      );

      if (response?.data?.data_source_name) {
        setIsSaveAsDraft(true);
      }

      if (response) {
        dispatch(updateRetrievalFlowName(response?.data?.data_source_name));
        if (response?.data?.retrievalJsonData?.drop_down_value) {
          // dispatch(
          //   updateRetrievalDropDownValue(response?.data?.retrievalJsonData?.drop_down_value)
          // );
        } else {
          updateRetrievalDropDownValue("");
        }
      }

      if (response?.data && !createNewRetrieval) {
        const dropDownValue = response?.data?.jsonData?.Select_Data_Source?.data;
        const apiResponse = response?.data?.retrievalJsonData?.retrievalFlowsJson;
        handleDropDownOption(dropDownValue);
        if (apiResponse) {
          dispatch(updateRetrievalJson(apiResponse));
          setTemp((temp) => ({
            ...temp,
            drop_down_value: retrievalJson?.drop_down_value,
            apply_filter: apiResponse?.apply_filter,
            choose_retrieval_strategy: apiResponse?.choose_retrieval_strategy,
            select_columns: apiResponse?.select_columns,
          }));
        }
      }

      if (createNewRetrieval) {
        const dropDownValue = response?.data?.jsonData?.Select_Data_Source?.data;
        handleDropDownOption(dropDownValue);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      dispatch(updateRetrievalIsLoading(false));
    }
  };

  // useEffect(() => {
  //   if (retrievalJson?.callHandleSave) {
  //     handleSaveData();
  //   }
  // }, [retrievalJson?.callHandleSave]);

  const handleDropDownOption = (value) => {
    const isExist = getSelectedItems(value);

    const data = isExist.map((data) => {
      return {
        id: data?._id,
        value: data?.file_name,
        label: data?.file_name,
      };
    });
    setSelectedOption(data);
  };

  const handleColumnData = (value) => {
    setColumnsList(value);
  };

  function getSelectedItems(data) {
    return data?.filter?.((item) => item.isSelected);
  }

  const handleSaveData = async () => {
    const payload = {
      indexId: projectId.indexId,
      jsonData: retrievalJson,
      name: retrievalJson.name,
    };
    if (saveTriggred) {
      dispatch(updateRetrievalUnSaveChanges(false));
    }

    if (retrievalJson.name === "" || retrievalJson.name === null) {
      setIsSaveModal({
        ...isSaveModal,
        state: true,
      });
    } else if (retrievalJson.name != "") {
      try {
        let response = await fetchData(
          `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/retrieval/data`,
          "POST",
          payload
        );
        if (response?.message) {
          toast.success(response?.message);
          dispatch(updateRetrievalCallHandleSave(false));
          fetchOption();
        }
        dispatch(updateRetrievalUnSaveChanges(false));
        dispatch(updateUnSaveChanges(false));
        setIsSaveLoading(false);
        setSaveTriggred(false);
        // if (process === 2) {
          navigate("/aiIndex/general",{state:{fromIndex:true}})
        // }
      } catch (error) {
        console.log("Error: ", error);
        toast.error(error);
      }
    }
  };

  const isValid = isEqual(temp, {
    ...retrievalJson?.retrievalFlowsJson,
    drop_down_value: retrievalJson?.drop_down_value,
  });

  useEffect(() => {
    if (
      projectId.projectId != undefined &&
      projectId.projectId != null &&
      projectId.userId != null &&
      !createNewRetrieval &&
      !createNewSearch
    ) {
      dispatch(updateRetrievalIsLoading(true));
      fetchOption();
      dispatch(updateRetrievalProcess(0));
    } else if (createNewRetrieval || createNewSearch) {
      fetchOption();
      dispatch(updateRetrievalIsLoading(false));
    }
  }, [projectId]);

  useEffect(() => {
    if (retrievalJson?.retrievalFlowsJson && !temp) {
      setTemp({
        ...retrievalJson?.retrievalFlowsJson,
        drop_down_value: retrievalJson?.drop_down_value,
      });
    }
  }, [retrievalJson]);

  useEffect(() => {
    if (temp) {
      dispatch(updateRetrievalUnSaveChanges(!isValid));
    }
  }, [isValid]);

  const handleProcessedComponent = () => {
    switch (process) {
      case 0:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100vh - 50px)",
            }}
          >
            <SelectColumnComponent
              columnsList={columnsList}
              setColumnsList={setColumnsList}
              dropDownValue={selectedOption}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                marginTop: "2rem",
                paddingX: 5,
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <StepButton
                  label={
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save As Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!retrievalUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
              </Box>
              <StepButton
                label="Next"
                color="dark"
                onClick={handleNext}
                disabled={!retrievalJson?.retrievalFlowsJson?.select_columns.status}
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100vh - 50px)",
            }}
          >
            <ApplyFilterComponent />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
                paddingX: 5,
              }}
            >
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <StepButton
                  label={
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save As Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!retrievalUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
                <StepButton
                  label="Next"
                  color="dark"
                  onClick={handleNext}
                  disabled={!retrievalJson?.retrievalFlowsJson?.apply_filter.status}
                />
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100vh - 50px)",
            }}
          >
            <RetrievalStrategyComponent />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
                paddingX: 5,
              }}
            >
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <StepButton
                  label={
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save As Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!retrievalUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Box
        sx={{
          gap: 4,
          paddingY: 10,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 50px)",
        }}
      >
        <ProgressBar steps={steps} process={process} />
        <Card
          sx={{
            paddingX: 4,
            paddingY: 5,
            display: "flex",
            gap: 10,
            overflowY: "auto",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h4">Choose Retrieval Strategy</Typography>
              <Typography variant="caption">
                {process === 2
                  ? "Apply transformations to user query and define retrieval strategy"
                  : "Set columns for selected field"}
              </Typography>
            </Box>

            {/* The autocomplete select component will not going show in the final step */}
            {process !== 2 && (
              <Box>
                <Autocomplete
                  disablePortal
                  options={selectedOption}
                  value={retrievalJson?.drop_down_value || null}
                  onChange={(event, newValue) => {
                    const data = retrievalJson?.retrievalFlowsJson;
                    const newData = {
                      ...data?.select_columns,
                      status: true,
                    };
                    dispatch(
                      updateSelectColumn({
                        ...data?.select_columns,
                        status: true,
                      })
                    );
                    dispatch(
                      updateApplyFilter({
                        ...data?.apply_filter,
                        status: true,
                      })
                    );
                    dispatch(updateRetrievalDropDownValue(newValue));
                  }}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Source Data"
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
              </Box>
            )}
          </Box>

          {handleProcessedComponent()}
        </Card>
      </Box>
    </>
  );
}
