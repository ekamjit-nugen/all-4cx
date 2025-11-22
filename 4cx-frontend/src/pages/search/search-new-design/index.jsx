import { Box, Card, CircularProgress } from "@mui/material";
import ProgressBar from "components/progress-bar";
import React, { useEffect, useState } from "react";
import StepButton from "../step-button";
import SelectDataSource from "./select-data-source";
import ChunkingStrategy from "./chunking-strategy";
import ChunkingEnrichment from "./chunk-enrichment";
import IndexingStrategy from "./indexing-strategy";
import fetchData from "services/api";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PopupModal from "components/pop-modal";
import { updateDataSource } from "store/features/searchSlice";
import { updateDataSourceName } from "store/features/searchSlice";
import { toast } from "react-toastify";
import { updateChunkStrategy } from "store/features/searchSlice";
import { updateChunkEnrichment } from "store/features/searchSlice";
import { updateIndexingStrategy } from "store/features/searchSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCallHandleSave } from "store/features/searchSlice";
import { updateUnSaveChanges } from "store/features/searchSlice";
import { updateSearchProcess } from "store/features/searchSlice";
import { isEqual } from "lodash";
import { updateSearchCreateNew } from "store/features/searchSlice";
import { updateIndexId } from "store/features/projectIdSlice";

const steps = [
  { label: "Select Data Source(s)" },
  { label: "Chunking Strategy" },
  { label: "Chunk Enrichment" },
  { label: "Indexing Strategy" },
];

export default function SearchNewDesign() {
  const searchRedux = useSelector((state) => state.searchFlow);
  const projectId = useSelector((state) => state.projectIdList);
  const createNewSearch = useSelector((state) => state.searchFlow.createNew);
  const createNewRetrieval = useSelector((state) => state.retrieval.createNew);
  const searchUnSaveChanges = useSelector((state) => state.searchFlow.unSaveChanges);
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [saveTriggred, setSaveTriggred] = useState(false);
  const [isSaveAsDraft, setIsSaveAsDraft] = useState(searchRedux?.name != "" ? true : false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [process, setProcess] = useState(0 || searchRedux?.process);
  const location = useLocation();
  const [isSaveModal, setIsSaveModal] = useState({
    state: false,
    data: "",
  });

  const isSelectSource = isEqual(searchRedux?.flowJsonData?.Select_Data_Source, {
    status: false,
  });

  useEffect(() => {
    if (
      projectId.projectId != undefined &&
      projectId.projectId != null &&
      projectId.userId != null &&
      !createNewSearch
    ) {
      fetchDataSourceData();
      dispatch(updateSearchProcess(0));
    }

    if (isSelectSource) {
      fetchDataSourceData();
    }

    if (createNewRetrieval && createNewSearch) {
      setIsLoading(false);
    }
  }, [projectId, userId, createNewRetrieval, createNewSearch, isSelectSource]);

  const handleNext = () => {
    setProcess((prevProcess) => prevProcess + 1);
  };

  const handlePrev = () => {
    setProcess((prevProcess) => prevProcess - 1);
  };

  const fetchDataSourceData = async () => {
    setIsLoading(true);
    const updateRedux = {
      data: [],
      status: false,
    };
    if (!searchRedux.createNew) {
      const saveData = await handleGetSaveData();
      if (saveData?.data?.length > 0 && !searchRedux.createNew) {
        updateRedux.data.push(...saveData.data.flat());
        updateRedux.status = saveData.status;
      }
    }

    try {
      const payload = {
        userId,
        projectId: projectId?.projectId,
      };
      const response = await fetchData(`/search/sourceData`, "POST", payload);
      if (response) {
        const data = response?.data?.map((data) => {
          return {
            data_type: data.data_type,
            file_name: data.file_name,
            is_deleted: data.is_deleted,
            _id: data._id,
            isSelected: false,
            url: data.url,
          };
        });

        if (data.length > 0) {
          updateRedux.data.push(...data.flat());
        }
        const updatedData = removeDuplicates(updateRedux?.data);
        const initialData = {
          data: updatedData,
          status: updateRedux?.status,
        };
        dispatch(updateDataSource(initialData));
        setTemp((temp) => ({
          ...temp,
          Select_Data_Source: initialData,
        }));
        // setTemp(searchRedux?.flowJsonData)
      }
    } catch (error) {
      console.log("ERROR:", error);
    }

    setIsLoading(false);
  };

  const removeDuplicates = (data) => {
    const seen = new Set();
    const uniqueData = [];

    for (const item of data) {
      if (!seen.has(item._id)) {
        seen.add(item._id);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  };

  const handleSaveData = async () => {
    // const datas = searchRedux.flowJsonData?.Select_Data_Source?.data?.filter(item=>item.isSelected)
    // const filter= {...searchRedux.flowJsonData?.Select_Data_Source,data:datas}
    // const filteredData = {...searchRedux.flowJsonData,Select_Data_Source:filter}
    const payload = {
      jsonData: searchRedux.flowJsonData,
      name: searchRedux.name,
    };

    if (saveTriggred) {
      dispatch(updateUnSaveChanges(false));
    }

    if (searchRedux.name === "" || searchRedux.name === null) {
      setIsSaveModal({
        ...isSaveModal,
        state: true,
      });
    } else if (searchRedux.name != "") {
      try {
        let response = await fetchData(
          `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
          "POST",
          payload
        );
        if (response?.message) {
          dispatch(updateIndexId(response?.data?._id));
          toast.success(response?.message);
          dispatch(updateCallHandleSave(false));
          dispatch(updateSearchCreateNew(false));
          dispatch(updateUnSaveChanges(false));
          fetchDataSourceData();
        }
        setIsSaveLoading(false);
        setSaveTriggred(false);
        // if (process === 3) {
          navigate("/aiIndex/general",{state:{fromIndex:true}})
        // }
      } catch (error) {
        console.log("Error: ", error);
        toast.error(error);
      }
    }
  };

  const handleGetSaveData = async () => {
    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "GET"
      );

      if (response?.data?.data_source_name) {
        dispatch(updateDataSourceName(response?.data?.data_source_name));
        setIsSaveAsDraft(true);
      }
      if (response?.data?.jsonData && !createNewSearch) {
        const responseData = response?.data?.jsonData;
        dispatch(updateChunkStrategy(responseData?.Chunking_Strategy));
        dispatch(updateChunkEnrichment(responseData?.Chunk_Enrichment));
        dispatch(updateIndexingStrategy(responseData?.Indexing_Strategy));
        setTemp((temp) => ({
          ...temp,
          Chunking_Strategy: responseData?.Chunking_Strategy,
          Chunk_Enrichment: responseData?.Chunk_Enrichment,
          Indexing_Strategy: responseData?.Indexing_Strategy,
        }));

        const isExist = getSelectedItems(response.data);
        if (isExist?.length > 0) {
          const data = {
            data: isExist,
            status: true,
          };
          return data;
        }
      } else {
        // setTemp(searchRedux?.flowJsonData)
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  function getSelectedItems(data) {
    let dataUpdated = [];
    dataUpdated.push(data.jsonData["Select_Data_Source"].data.filter((item) => item.isSelected));
    return dataUpdated;
  }

  const handelSaveModal = (data) => {
    if (data.state === false) {
      setIsSaveModal({
        ...data,
        state: false,
      });
      setIsSaveLoading(false);
    } else if (data.state === true) {
      setIsSaveModal({
        ...data,
        state: false,
      });
      handleSaveData();
    }
  };

  const isValid = isEqual(temp, searchRedux?.flowJsonData);

  useEffect(() => {
    if (searchRedux?.flowJsonData && !temp) {
      setTemp(searchRedux?.flowJsonData);
    }
  }, [searchRedux]);

  useEffect(() => {
    if (temp) {
      dispatch(updateUnSaveChanges(!isValid));
    }
  }, [isValid]);

  const isChunkingStrategy = () => {
    const data = searchRedux?.flowJsonData?.Chunking_Strategy.selectedOptionArray;
    const existingCategory = data.find((option) => option.chunkingType != "");

    if (data.length <= 0) {
      return true;
    } else if (data.length > 0 && existingCategory) {
      return false;
    } else {
      return true;
    }
  };

  const isChunkEnrichment = () => {
    const data = searchRedux?.flowJsonData?.Chunk_Enrichment?.selectedOptions;

    if (data?.length <= 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleProcessedComponent = () => {
    switch (process) {
      case 0:
        return (
          <>
            <SelectDataSource isLoading={isLoading} />
            <Box sx={{ display: "flex", justifyContent: "end", marginTop: "2rem", paddingX: 5 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <StepButton
                  label={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!searchUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
                <StepButton
                  label="Next"
                  color="dark"
                  onClick={handleNext}
                  disabled={!searchRedux?.flowJsonData?.Select_Data_Source?.status}
                />
              </Box>
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <ChunkingStrategy />
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!searchUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
                <StepButton
                  label="Next"
                  color="dark"
                  onClick={handleNext}
                  disabled={isChunkingStrategy()}
                />
              </Box>
            </Box>
          </>
        );

      case 2:
        return (
          <>
            <ChunkingEnrichment />
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
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isSaveLoading ? (
                        <CircularProgress size={24} />
                      ) : isSaveAsDraft ? (
                        "Save Draft"
                      ) : (
                        "Save"
                      )}
                    </Box>
                  }
                  color="light"
                  disabled={!searchUnSaveChanges}
                  onClick={() => {
                    setIsSaveLoading(true), handleSaveData();
                  }}
                />
                <StepButton
                  label="Next"
                  color="dark"
                  onClick={handleNext}
                  disabled={isChunkEnrichment()}
                />
              </Box>
            </Box>
          </>
        );

      case 3:
        return (
          <>
            <IndexingStrategy />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
                paddingX: 5,
              }}
            >
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <StepButton
                label={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isSaveLoading ? (
                      <CircularProgress size={24} />
                    ) : isSaveAsDraft ? (
                      "Save Draft"
                    ) : (
                      "Save"
                    )}
                  </Box>
                }
                color="light"
                disabled={!searchUnSaveChanges}
                onClick={() => {
                  handleSaveData();
                }}
              />
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Are you sure you want to leave this page?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
            overflowY: "auto",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
            justifyContent: "space-between",
          }}
        >
          {handleProcessedComponent()}
        </Card>
      </Box>
      {isSaveModal.state && (
        <PopupModal type="input" isOpen={handelSaveModal} title="Save Data Source Flow" isIndexFlow={true}/>
      )}
    </>
  );
}
