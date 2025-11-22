import React, { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import Input from "./modules/input";
import fetchData from "services/api";
import "@xyflow/react/dist/style.css";
import { toast } from "react-toastify";
import ChatMessage from "pages/chat-message";
import { useAuth } from "@clerk/clerk-react";
import PageLoader from "components/page-loader";
import TextNode from "./modules/prompt/text-node";
import { initialEdges, initialNodes } from "./consts";
import SaveModal from "pages/orchestrate/save-modal";
import SearchNode from "./modules/search/search-node";
import OutPutNode from "./modules/output/output-node";
import { useSelector, useDispatch } from "react-redux";
import ChatMessageNode from "./modules/chat/chat-node";
import ChatHistory from "./modules/chat/chatHistory-node";
import useReactFlowOutputJson from "hooks/useReactFlowOutputJson";
import { Box, Button, Paper, MenuItem, Select, Card } from "@mui/material";
import {
  updateApiLoading,
  updateOutputData,
  updateUserData,
  updateAgentData,
} from "store/features/chatSlice";

const promptTypes = {
  inputNode: "inputNode",
  text: "text",
  chat: "chat",
  output: "outPut",
  chatHistory: "chatHistory",
  search: "search",
};

const getNodeData = (type) => {
  const data = {
    inputNode: { textFields: [] },
    text: {
      promptData: [],
    },
    chat: {
      firstHeading: "Chat GPT Message",
      secondHeading: "Message Content",
      radioButtons: [
        { radio_id: "radio-1", label: "System" },
        { radio_id: "radio-2", label: "Assistant" },
        { radio_id: "radio-3", label: "User" },
      ],
      radioHeading: "Role",
      buttonText: "Add variable",
      template: "Mustache Template is used here, use variable name to insert a variable.",
    },
    chatHistory: { inputHeading: "Input", inputButtonText: "Add Variable" },
    outPut: { outPutHeading: "Output", outPutButtonText: "Show Output" },
  };
  return data[type] || {};
};

function Flow({ value, onChangeFlow, apiDataValue, setStateValue }) {
  const { userId, orgId } = useAuth();
  const [isChat, setIsChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupModal, setIsPopUpModal] = useState({
    state: false,
    data: "",
  });
  const [flowDataJson, setFlowDataJson] = useState([]);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [isSaveModal, setIsSaveModal] = useState(false);
  const { extractRelevantData } = useReactFlowOutputJson();
  const [selectedType, setSelectedType] = useState("inputNode");
  const isUpdate = useSelector((state) => state.reactFlow.isUpdate);
  const promptState = useSelector((state) => state.prompt.flowData);
  const isChatLoading = useSelector((state) => state.chat.isLoading);
  const selectedVersion = useSelector((state) => state.prompt.version);
  const [isShowOutputEnabled, setIsShowOutputEnabled] = useState(false);
  const selectedPromptID = useSelector((state) => state.prompt.promptId);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const orchestrateId = useSelector((state) => state.projectIdList.projectId);
  const actionFlowData = useSelector((state) => state.reactFlow.reactFlowData);
  const selectedPromptRedux = useSelector((state) => state.reactFlow.selectedPrompt);
  const userData = useSelector((state) => state.chat.chatData);

  const handleSuccessSnackbar = (message) => {
    toast.success(message);
  };

  const dispatch = useDispatch();

  const fetchPromptList = async (json) => {
    const payload = {
      userId,
      projectId,
      promptId: selectedPromptRedux?.prompt_id,
      version: selectedPromptRedux?.version,
      jsonData: json,
    };
    try {
      setLoading(true);
      const response = await fetchData("/orchestrate/flow", "POST", payload);

      if (response) {
        toast.success(response.message);
        setIsShowOutputEnabled(true);
      }
    } catch (error) {
      console.log("error fetching data", error);
      toast.error("There was an error fetching your data.");
      setIsShowOutputEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (promptState) {
      const nodes =
        promptState.nodes?.length > 0
          ? JSON.parse(JSON.stringify(promptState.nodes))
          : initialNodes;
      const edges =
        promptState.edges?.length > 0
          ? JSON.parse(JSON.stringify(promptState.edges))
          : initialEdges;

      setNodes(nodes);
      setEdges(edges);
      setStateValue({
        inputValue: actionFlowData.flow_name,
        selectedModalValue: actionFlowData?.json_prompt_flow?.nodes?.[2]?.data?.chatMessageData,
        selectedPromptValue: actionFlowData.prompt_title,
        selectedVersionValue: actionFlowData.version,
        selectedDescription: "",
      });
    }
  }, [promptState]);

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (connection) => {
    const newEdge = { ...connection, id: `${connection.source}-${connection.target}` };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const handleAddButtonClick = () => {
    const newNodes = Array.from({ length: 1 }, (_, index) => ({
      id: `${selectedType}-${Date.now()}-${index}`,
      type: selectedType,
      position: { x: 50 * (index + 1), y: 300 },
      data: getNodeData(selectedType),
    }));

    const ifExist = nodes.find((data) => data?.type === selectedType);

    if (!ifExist || selectedType === "chat" || selectedType === "search") {
      setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    } else {
      toast.error("Can't Add Duplicate Node");
    }
  };

  const handleUpdateNodeData = (nodeId, updatedData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );
  };

  const handleOpenModal = () => {
    setIsSaveModal(true);
  };

  const handleCloseSave = () => {
    setIsSaveModal(false);
  };

  const handleRemoveNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const handleChat = async (flowData) => {
    const data = extractRelevantData(flowData);
    handleGetChatToken("user", data?.input_query?.[0]?.value);
    const payload = {
      question: data?.input_query?.[0]?.value,
      prompt_text: data?.prompt_text,
      chat_history: data?.chat_history,
      search_index: {
        index_name: "",
        columns: ["chunk"],
        data_filter: "*",
        top_k: 5,
      },
      input_query: data?.input_query,
      chat_gpt_message: data?.chat_gpt_message,
    };

    dispatch(updateApiLoading(true));
    const response = await fetchData(
      "https://fourcx-openai.azurewebsites.net/api/CallAOAI?code=YX50gOq1K7nKaKnyaVvSg8V_FDiY4QXxWQE-QlRR0xjgAzFu1CnmaQ%3D%3D",
      "POST",
      payload
    );
    dispatch(updateUserData(data?.input_query?.[0]?.value));
    if (response?.message != "") {
      handleGetChatToken("ai_assistant", response?.message);
      dispatch(updateApiLoading(false));
      dispatch(updateAgentData(response?.message));
      dispatch(updateOutputData(data));
    }
  };

  const handleGetChatToken = async (type, value) => {
    const payload = {
      messages: userData,
      model: "gpt-3.5-turbo-0613",
    };
    const response = await fetchData(
      "https://fourcx-openai.azurewebsites.net/api/CountTokens?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D",
      "POST",
      payload
    );

    if (response) {
      handleSaveChat(type, { value, response });
    }
  };

  const handleSaveChat = async (type, value) => {
    if (type === "ai_assistant") {
      const payload = {
        userId,
        // chatModel,
        projectId,
        organizationId: orgId,
        orchestrateId,
        chatData: {
          type: "ai_assistant",
          message: value.value,
        },
        usageToken: value.response,
      };
      const response = await fetchData("/chat", "POST", payload);
    } else if (type === "user") {
      const payload = {
        userId,
        // chatModel,
        projectId,
        organizationId: orgId,
        orchestrateId,
        chatData: {
          type: "user",
          message: value.value,
        },
        usageToken: value.response,
      };
      const response = await fetchData("/chat", "POST", payload);
    }
  };

  const getFlowData = async () => {
    const flowData = { nodes, edges };
    setFlowDataJson(flowData);
    const payload = {
      projectId,
      promptId: selectedPromptID,
      userId,
      jsonData: flowData,
      version: selectedVersion || value?.selectedVersionValue,
    };

    try {
      setLoading(true);
      const response = await fetchData("/orchestrate/run", "POST", payload);

      if (response) {
        toast.success(response.message);
        setIsShowOutputEnabled(true);
        handleChat(flowData);
        handleRunApi();
      }
    } catch (error) {
      console.log("error fetching data", error);
      toast.error("There was an error fetching your data.");
      setIsShowOutputEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRunApi = async () => {
    try {
      const response = await fetchData(
        `/orchestrate/run?orchestrateId=${actionFlowData?._id}`,
        "GET"
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOnSaveButton = async (name, onSave) => {
    const flowData = { nodes, edges };
    const payload = {
      userId,
      projectId,
      promptId: selectedPromptID,
      version: selectedVersion,
      jsonData: flowData,
      name: name?.input,
      organizationId: orgId,
      category: name?.category,
    };
    if (onSave) {
      try {
        setLoading(true);
        const response = await fetchData("/orchestrate/flow", "POST", payload, userId);

        if (response) {
          toast.success(response.message);
          setIsShowOutputEnabled(true);
          handleCloseSave();
        }
      } catch (error) {
        toast.error("There was an error fetching your data.");
        setIsShowOutputEnabled(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleValueChange = (nodeId, newValue) => {
    handleUpdateNodeData(nodeId, { selectedValue: newValue });
  };

  const handleChatButton = () => {
    setIsChat(!isChat);
  };

  const handlePopupState = (name, value) => {
    if (name === "data") {
      setIsPopUpModal({
        state: true,
        [name]: value,
      });
    } else if (name === "state") {
      setIsPopUpModal({
        ...isPopupModal,
        [name]: value,
      });
    } else if (name.state === false) {
      setIsPopUpModal({
        state: false,
        [name]: value,
      });
    }
  };

  const handleUpdateFlow = async () => {
    const flowData = { nodes, edges };
    const payload = {
      userId,
      isUpdated: true,
      jsonData: flowData,
      version: selectedVersion || value?.selectedVersionValue,
      projectId,
      organizationId: orgId,
      promptId: selectedPromptID,
      name: actionFlowData?.flow_name,
      category: actionFlowData?.category,
    };

    try {
      setLoading(true);
      const response = await fetchData("/orchestrate/flow", "POST", payload,userId);

      if (response) {
        toast.success("Flow updated Successfully");
        setIsShowOutputEnabled(true);
        handleCloseSave();
      }
    } catch (error) {
      toast.error("There was an error fetching your data.");
      setIsShowOutputEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const nodeTypes = useMemo(
    () => ({
      inputNode: (props) => (
        <Input
          {...props}
          onUpdateData={(updatedFields) =>
            handleUpdateNodeData(props.id, { textFields: updatedFields })
          }
          onRemoveNode={() => handleRemoveNode(props.id)}
          handleTextChange={onChangeFlow}
          value={value}
        />
      ),
      text: (props) => (
        <TextNode
          {...props}
          nodes={nodes}
          onUpdatePromptData={(newPromptData) =>
            handleUpdateNodeData(props.id, { promptData: newPromptData })
          }
          value={value}
          apiPromptData={apiDataValue}
          handleDropdownChange={onChangeFlow}
          onRemoveNode={() => handleRemoveNode(props.id)}
        />
      ),
      chatHistory: (props) => (
        <ChatHistory
          {...props}
          onUpdateChatData={(updatedChatHistory) =>
            handleUpdateNodeData(props.id, {
              chatHistory: updatedChatHistory,
            })
          }
          value={value}
          onRemoveNode={() => handleRemoveNode(props.id)}
          apiPromptData={apiDataValue}
          handleDropdownChange={onChangeFlow}
        />
      ),

      outPut: (props) => (
        <OutPutNode
          {...props}
          value={value}
          flowDataJson={flowDataJson}
          isShowOutputEnabled={isShowOutputEnabled}
          updateShowOutput={setIsShowOutputEnabled}
          snackBarMessage={handleSuccessSnackbar}
          onRemoveNode={() => handleRemoveNode(props.id)}
        />
      ),
      chat: (props) => (
        <>
          <ChatMessageNode
            {...props}
            value={value}
            apiPromptData={apiDataValue}
            handleDropdownChange={onChangeFlow}
            onRemoveNode={() => handleRemoveNode(props.id)}
            // onChatValueChange={(newPromptData) =>{
            //   handleUpdateNodeData(props.id, { chatMessageData: newPromptData })
            //   setStateValue((prev)=>({...prev, [props.id]: newPromptData }));
            // }}
            selectedChatVersion={props.data.selectedValue}
            onChatValueChange={(newValue) => handleValueChange(props.id, newValue)}
          />
        </>
      ),
      search: (props) => (
        <SearchNode
          {...props}
          onRemoveNode={() => handleRemoveNode(props.id)}
          selectedValue={props?.data?.selectedValue}
          onValueChange={(newValue) => handleValueChange(props.id, newValue)}
        />
      ),
    }),
    [apiDataValue, value, isShowOutputEnabled]
  );

  return (
    <Box sx={{ position: "relative", height: "600px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: 4,
            pl: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ marginRight: 2 }}
            >
              <MenuItem value={promptTypes.inputNode}>Input Node</MenuItem>
              <MenuItem value={promptTypes.text}>Text Node</MenuItem>
              <MenuItem value={promptTypes.chat}>Chat Node</MenuItem>
              <MenuItem value={promptTypes.output}>Output Node</MenuItem>
              <MenuItem value={promptTypes.chatHistory}>Chat History</MenuItem>
              <MenuItem value={promptTypes.search}>Search Component</MenuItem>
            </Select>
            <Button
              onClick={handleAddButtonClick}
              sx={{
                border: "1px solid",
                fontSize: "14px",
                backgroundColor: "#0d6aca",
                padding: "5px 14px",
                borderRadius: "10px",
                color: "white !important",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#0d6aca !important",
                },
              }}
            >
              Add
            </Button>
            <Button
              onClick={getFlowData}
              sx={{
                width: "30%",
                border: "1px solid",
                fontSize: "14px",
                backgroundColor: "#4caf50",
                padding: "5px 24px",
                borderRadius: "10px",
                color: "white !important",
                marginLeft: 2,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#0d6aca !important",
                },
              }}
            >
              compile
            </Button>

            {!isUpdate ? (
              <Button
                onClick={handleOpenModal}
                sx={{
                  width: "30%",
                  border: "1px solid",
                  fontSize: "14px",
                  backgroundColor: "#4caf50",
                  padding: "5px 14px",
                  borderRadius: "10px",
                  color: "white !important",
                  marginLeft: 4,
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#0d6aca !important",
                  },
                }}
              >
                SAVE
              </Button>
            ) : (
              <Button
                onClick={handleUpdateFlow}
                sx={{
                  width: "30%",
                  border: "1px solid",
                  fontSize: "12px",
                  backgroundColor: "red",
                  padding: "5px 14px",
                  borderRadius: "10px",
                  color: "white !important",
                  marginLeft: 4,
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#0d6aca !important",
                  },
                }}
              >
                Update
              </Button>
            )}

            <Button
              onClick={handleChatButton}
              sx={{
                width: "30%",
                border: "1px solid",
                fontSize: "14px",
                backgroundColor: "#fdd409",
                padding: "5px 14px",
                borderRadius: "10px",
                color: "white !important",
                marginLeft: 2,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#0d6aca !important",
                },
              }}
            >
              CHAT
            </Button>
          </Box>
        </Paper>
        {loading ? (
          <PageLoader />
        ) : (
          <Card sx={{ height: "85vh", pb: 3 }}>
            <ReactFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              style={{ width: "100%", height: "100vh" }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </Card>
        )}

        {isSaveModal && (
          <Box
            sx={{
              width: "100%",
              height: "90vh",
              display: "flex",
              alignItems: "center",
              position: "absolute",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              background: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card
              sx={{
                height: "40%",
                width: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SaveModal
                handleCloseSave={handleCloseSave}
                handleOnSaveButton={handleOnSaveButton}
              />
            </Card>
          </Box>
        )}
      </Box>
      {isChat && (
        <Box
          sx={{
            top: 10,
            right: 0,
            width: 500,
            boxShadow: 8,
            height: "85vh",
            borderRadius: 3,
            overflow: "auto",
            border: "2px solid slate",
            position: "absolute",
            background: "white",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            opacity: isChat ? 1 : 0,
            transform: isChat ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <ChatMessage handleClose={handleChatButton} />
        </Box>
      )}
    </Box>
  );
}

export default Flow;
