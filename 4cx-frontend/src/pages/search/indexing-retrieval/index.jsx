import * as React from "react";
import MemoryIcon from "@mui/icons-material/Memory";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import SoftButton from "components/soft-button";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import fetchData from "services/api";
import { updateSearchProcess } from "store/features/searchSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { updateRetrievalProcess } from "store/features/retrievalSlice";
import PageLoader from "components/page-loader";
import { useState } from "react";
import { resetSearchJson } from "store/features/searchSlice";
import { resetRetrievalJson } from "store/features/retrievalSlice";
import { toast } from "react-toastify";
import { updateDataSourceName } from "store/features/searchSlice";
import { updateSearchCreateNew } from "store/features/searchSlice";
import { updateRetrievalCreateNew } from "store/features/retrievalSlice";
import { updateSelectColumn } from "store/features/retrievalSlice";
import { setExtractPrompt } from "store/features/socketSlice";
import { setNotificationStatus } from "store/features/socketSlice";
import { startUpload } from "store/features/fileUploadSlice";
import { completeUpload } from "store/features/fileUploadSlice";
import { startLinearUpload } from "store/features/fileUploadSlice";
import { completeLinearUpload } from "store/features/fileUploadSlice";
import { NotStarted } from "@mui/icons-material";
import { indexDataSources } from "store/features/socketSlice";
import { updateIndexDataSources } from "store/features/socketSlice";

export default function IndexingRetrieval() {
  const searchRedux = useSelector((state) => state.searchFlow);
  const retrival = useSelector((state) => state.retrieval);
  const retrievalData = useSelector((state) => state.retrieval.retrievalFlowsJson);
  const searchData = useSelector((state) => state.searchFlow.flowJsonData);
  const [retrievalJson, setRetrievalJson] = useState(retrievalData);
  const [searchIndexingJson, setSearchIndexingJson] = useState(searchData);
  const projectId = useSelector((state) => state.projectIdList);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useNavigate();
  const searchSaveState = useSelector((state) => state.searchFlow.callHandleSave);
  const createNewSearch = useSelector((state) => state.searchFlow.createNew);
  const createNewRetrieval = useSelector((state) => state.retrieval.createNew);

  const [pollingStatus, setPollingStatus] = useState("pending");
  const [pollingCount, setPollingCount] = useState(0);
  const indexingStatus = useSelector((state) => state.socket.indexStatus);
  const [buttonLoading, setButtonLoading] = useState(false);
  // const [indexingStatus,setIndexingStatus] = useState('notStarted')

  const handleSaveNotification = async (payload) => {
    try {
      const response = fetchData(
        `/notification/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/user/${projectId?.userId}/notification
      `,
        "POST",
        payload
      );
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const { state } = useLocation();
  const visited = state ? state.fromIndex : false;
  const indexingData = [
    {
      id: 0,
      header: "Indexing Configuration",
      items: [
        {
          id: 0,
          title: "Select Data Source(s)",
          icon: MemoryIcon,
          status: searchIndexingJson?.Select_Data_Source?.status,
          route: "/search/indexing",
          process: 0,
          // disabled: false,
        },
        {
          id: 1,
          title: "Select Chunking Strategy",
          icon: MemoryIcon,
          status: searchIndexingJson?.Chunking_Strategy?.status,
          route: "/search/indexing",
          process: 1,
          // disabled: !searchIndexingJson?.Select_Data_Source?.status,
        },
        {
          id: 2,
          title: "Chunk Enrichment",
          icon: MemoryIcon,
          status: searchIndexingJson?.Chunk_Enrichment?.status,
          route: "/search/indexing",
          process: 2,
          // disabled: !searchIndexingJson?.Chunk_Enrichment?.status,
        },
        {
          id: 3,
          title: "Indexing Strategy",
          icon: MemoryIcon,
          status: searchIndexingJson?.Indexing_Strategy?.status,
          route: "/search/indexing",
          process: 3,
          // disabled: !searchIndexingJson?.Indexing_Strategy?.status,
        },
      ],
      button: "start indexing",
    },
    {
      id: 0,
      header: "Retrieval Configuration",
      items: [
        {
          id: 0,
          title: "Select Columns",
          icon: MemoryIcon,
          status: retrievalJson?.select_columns?.status,
          route: "/search/retrieval",
          process: 0,
          // disabled:
          // !searchIndexingJson?.Select_Data_Source?.status ||
          // !searchIndexingJson?.Chunking_Strategy?.status ||
          // !searchIndexingJson?.Chunk_Enrichment?.status ||
          // !searchIndexingJson?.Indexing_Strategy?.status,
        },
        {
          id: 1,
          title: "Apply Filters",
          icon: MemoryIcon,
          status: retrievalJson?.apply_filter?.status,
          route: "/search/retrieval",
          process: 1,
          // disabled: !retrievalJson?.apply_filter?.status,
        },
        {
          id: 2,
          title: "Choose Retrieval Strategy",
          icon: MemoryIcon,
          status: retrievalJson?.choose_retrieval_strategy?.status,
          route: "/search/retrieval",
          process: 2,
          // disabled: !retrievalJson?.choose_retrieval_strategy?.status,
        },
      ],
      button: "save configuration",
    },
  ];

  const getSaveData = async () => {
    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "GET"
      );

      if (response?.data) {
        const retrievalData = response?.data?.retrievalJsonData?.retrievalFlowsJson;
        dispatch(updateDataSourceName(response?.data?.data_source_name));
        if (retrievalData) {
          setRetrievalJson(retrievalData);
        }
        if (response?.data?.jsonData && !searchSaveState) {
          setSearchIndexingJson(response?.data?.jsonData);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };

  const handleStartIndexingStatus = (buttonValue) => {
    if (buttonValue === "start indexing") {
      if (
        searchIndexingJson?.Select_Data_Source?.status === true &&
        searchIndexingJson?.Chunking_Strategy?.status === true &&
        searchIndexingJson?.Chunk_Enrichment?.status === true &&
        searchIndexingJson?.Indexing_Strategy?.status === true
        // retrievalJson?.select_columns?.status === true &&
        // retrievalJson?.apply_filter?.status === true &&
        // retrievalJson?.choose_retrieval_strategy?.status === true
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (
        // searchIndexingJson?.Select_Data_Source?.status === true &&
        // searchIndexingJson?.Chunking_Strategy?.status === true &&
        // searchIndexingJson?.Chunk_Enrichment?.status === true &&
        // searchIndexingJson?.Indexing_Strategy?.status === true
        retrievalJson?.select_columns?.status === true &&
        retrievalJson?.apply_filter?.status === true &&
        retrievalJson?.choose_retrieval_strategy?.status === true
      ) {
        return false;
      } else {
        return true;
      }
    }
  };

  const handleStartIndexing = async () => {
    setPollingStatus("start");
    try {
      const response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "PATCH",
        {
          status: "Indexing in Progress",
          indexId: projectId?.indexId,
        }
      );
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const handleStartIndexingPost = async () => {
    try {
      const datas = searchRedux.flowJsonData?.Select_Data_Source?.data?.filter(
        (item) => item.isSelected
      );
      const filter = { ...searchRedux.flowJsonData?.Select_Data_Source, data: datas };
      const filteredData = { ...searchRedux.flowJsonData, Select_Data_Source: filter };

      const payload = {
        jsonData: filteredData,
        indexId: projectId?.indexId,
        userId: projectId?.userId,
      };
      // const arr = Array.from({ length: datas.length }, (_, i) => ({id:i,status: 'startIndexing' }));
      // console.log(arr ,"Arr")
      // dispatch(indexDataSources(arr))

      // console.log(datas.length ,"filterData")
      const resp = await fetchData(
        `/search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/searchIndex`,
        "POST",
        payload,
        projectId?.userId
      );
      if (resp) {
        // setPollingStatus("pending");
        // dispatch(completeLinearUpload());
        setButtonLoading(false)

        const data = resp?.indexers.map((value) => ({ id: value, status: "Start Indexing" }));
        dispatch(indexDataSources(data));
        dispatch(updateIndexDataSources(resp?.indexers));

        // handleIndexflow(resp?.data);
      }
    } catch (error) {
      setButtonLoading(false)
      console.error(error, "Error while indexing");
    }
  };

  const handleIndex = () => {
    setButtonLoading(true);
    handleStartIndexing();
    handleStartIndexingPost();
  };
  useEffect(() => {
    const handleRefresh = async () => {
      dispatch(resetSearchJson());
      dispatch(resetRetrievalJson());
      dispatch(updateSearchCreateNew(true));
      dispatch(updateRetrievalCreateNew(true));
      dispatch(updateSelectColumn({}));
      router("/aiIndex/general");
      setIsLoading(false);
      setSearchIndexingJson((searchData) => {
        searchData;
      });
      setRetrievalJson((retrievalData) => {
        retrievalData;
      });
    };
    if (state === null && !visited) {
      handleRefresh();
    }
  }, [state]);

  useEffect(() => {
    if (
      projectId.projectId != null &&
      projectId.projectId != null &&
      projectId.userId != null &&
      !createNewSearch &&
      !createNewRetrieval &&
      visited
    ) {
      setIsLoading(true);
      getSaveData();
    }
  }, [projectId]);

  return (
    <Card
      sx={{
        gap: 8,
        paddingX: 4,
        paddingTop: 5,
        paddingBottom: 4,
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        height: "calc(100vh - 150px)",
      }}
    >
      {!isLoading ? (
        <>
          <Typography>Index Name: {searchRedux?.name || "Creating New"}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {indexingData.map((data) => {
              const { id, header, items } = data;
              return (
                <Box key={id} sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 700,
                      borderBottom: 1,
                      borderColor: "lightGray",
                    }}
                  >
                    {header}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {items.map((data) => {
                      const { id, title, icon: Icons, status, route, process, disabled } = data;
                      return (
                        <Card
                          key={id}
                          sx={{
                            paddingY: 4,
                            width: 250,
                            height: 250,
                            display: "flex",
                            alignItems: "center",
                            border: status ? 2 : 1,
                            justifyContent: "space-between",
                            opacity: disabled && 0.2,
                            borderColor: status ? "lightgreen" : null,
                            "&:hover": {
                              boxShadow: !disabled && 5,
                              cursor: !disabled && "pointer",
                            },
                          }}
                          onClick={() => {
                            router(route);
                            if (route === "/search/indexing" && !disabled) {
                              dispatch(updateSearchProcess(process));
                            } else if (route === "/search/retrieval" && !disabled) {
                              dispatch(updateRetrievalProcess(process));
                            }
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ fontSize: 40 }}>
                              <Icons />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: 16,
                              }}
                            >
                              {title}
                            </Typography>
                          </Box>

                          <Box sx={{ fontSize: 40, color: status ? "green" : "lightgray" }}>
                            <VerifiedIcon />
                          </Box>
                        </Card>
                      );
                    })}
                  </Box>
                  {data.button && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        // marginTop: 20,
                      }}
                    >
                      <SoftButton
                        variant="gradient"
                        color="dark"
                        disabled={handleStartIndexingStatus(data?.button) ? true : false}
                        onClick={handleIndex}
                      >
                        {data?.button === "start indexing" ? (
                          buttonLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            data?.button
                          )
                        ) : (
                          data?.button
                        )}
                      </SoftButton>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      ) : (
        <PageLoader />
      )}
    </Card>
  );
}
