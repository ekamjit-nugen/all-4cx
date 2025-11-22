import React, { useEffect, useState } from "react";
import { setPromptLoading } from "store/features/promptSlice";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import fetchData from "services/api";
import Flow from "./react-flow";
import { resetReactFlowData } from "store/features/reactFlowSlice";
import { resetChatData } from "store/features/chatSlice";
import { updateVersion } from "store/features/promptSlice";

export const initialOrchestrateState = [
  {
    inputValue: "",
    selectedModalValue: "",
    selectedPromptValue: "",
    selectedVersionValue: "",
    selectedDescription: "",
  },
];

export default function ParentComponentFlow() {
  const { userId, orgId } = useAuth();
  const [apiData, setApiData] = useState([]);
  const [flowData, setFlowData] = useState(initialOrchestrateState);
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const prompt = useSelector((state) => state.prompt);
  const handleFlowData = (obj) => {
    setFlowData({
      ...flowData,
      ...obj,
    });
  };

  const fetchPromptData = async () => {
    try {
      let response;

      response = await fetchData(
        `/prompt/organizations/${orgId}/projects/${projectId}/authors/${userId}/prompt`,
        "GET"
      );

      if (response.data && response.data.length > 0) {
        dispatch(updateVersion(response?.data[0]?.prompt_version));
        setApiData(response?.data);
      } else {
        console.error("Expected an array of data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      dispatch(setPromptLoading(false));
    }
  };

  useEffect(() => {
    if (userId && orgId && projectId) {
      fetchPromptData();
      // dispatch(resetReactFlowData()); // comment as the version was not visible on click edit flow
      dispatch(resetChatData());
    }
  }, [projectId, userId, orgId]);

  return (
    <Flow
      value={flowData}
      onChangeFlow={handleFlowData}
      apiDataValue={apiData}
      setStateValue={setFlowData}
    />
  );
}
