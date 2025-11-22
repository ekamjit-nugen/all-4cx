import { useAuth } from "@clerk/clerk-react";
import { Close, Delete } from "@mui/icons-material";
import { Box, Input, Typography } from "@mui/material";
import SoftButton from "components/soft-button";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "services/api";
import {
  updateApiLoading,
  resetChatData,
  updateUserData,
  updateAgentData,
} from "store/features/chatSlice";

const ChatMessage = ({ handleClose }) => {
  const dispatch = useDispatch();
  const chatContainerRef = useRef(null);
  const [input, setInput] = useState("");
  const { userId, orgId } = useAuth();
  const userData = useSelector((state) => state.chat.chatData);
  const flowData = useSelector((state) => state.chat.outputData);
  const isApiLoading = useSelector((state) => state.chat.apiLoading);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const orchestrateId = useSelector((state) => state.projectIdList.projectId);
  const chatModel = useSelector((state) => state.projectIdList.chatModel);
  const actionFlowData = useSelector((state) => state.reactFlow.reactFlowData);

  const getAgentResponse = async () => {
    dispatch(updateApiLoading(true));
    handleGetChatToken("user", input);
    const payload = {
      question: input,
      prompt_text: flowData?.prompt_text,
      chat_history: userData,
      search_index: {
        index_name: "",
        columns: ["chunk"],
        data_filter: "*",
        top_k: 5,
      },
      input_query: [
        {
          id: "input1",
          value: input,
        },
      ],
      chat_gpt_message: flowData?.chat_gpt_message,
    };

    const response = await fetchData(
      "https://fourcx-openai.azurewebsites.net/api/CallAOAI?code=YX50gOq1K7nKaKnyaVvSg8V_FDiY4QXxWQE-QlRR0xjgAzFu1CnmaQ%3D%3D",
      "POST",
      payload
    );

    if (response?.message !== "") {
      handleGetChatToken("ai_assistant", response?.message);
      dispatch(updateAgentData(response?.message));
      dispatch(updateApiLoading(false));
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
        chatModel,
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
        chatModel,
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

  const handleSendButton = () => {
    setInput("");
    getAgentResponse();
    handleRunApi();
    dispatch(updateUserData(input));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendButton();
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userData]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80.5vh" }}>
      <Box
        sx={{
          boxShadow: 2,
          width: "100%",
          display: "flex",
          borderRadius: 2,
          padding: "15px",
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderBottom: "1px solid #e485f0",
        }}
      >
        <Typography sx={{ width: "90%" }}>Chat</Typography>

        <Typography
          sx={{
            width: "10%",
            fontSize: 22,
            fontWeight: 700,
            "&:hover": {
              color: "red",
              cursor: "pointer",
            },
          }}
          onClick={handleClose}
        >
          <Close />
        </Typography>
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          paddingY: 1,
          paddingX: 2,
          display: "flex",
          overflowY: "auto",
          background: "#F5F5F5",
          flexDirection: "column",
          height: "calc(100vh - 60px)",
        }}
      >
        {userData?.length > 0 &&
          userData?.map((data, index) => {
            const isQuestion = data?.inputs?.question;
            const isAnswer = data?.outputs?.answer;

            const isUserMessage = isQuestion;
            return (
              <Box
                key={index}
                sx={{
                  alignSelf: isUserMessage ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  paddingY: 2,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: isUserMessage ? "#1976d2" : "#e0e0e0",
                    color: isUserMessage ? "#FFFFFF" : "#000000",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    borderTopRightRadius: isUserMessage ? 0 : "10px",
                    borderTopLeftRadius: isUserMessage ? "10px" : 0,
                    display: "inline-block",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                  }}
                >
                  {data?.inputs?.question}
                  {data?.outputs?.answer}
                </Typography>
              </Box>
            );
          })}

        {userData?.length <= 0 ||
          (userData === undefined && (
            <Box sx={{ justifyContent: "flex-end", flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  paddingTop: 2,
                  display: "flex",
                  color: "darkGray",
                  textAlign: "center",
                  flexDirection: "column",
                  textDecoration: "underline",
                }}
              >
                {userData != undefined ? "Start Your Chat" : "Press Show Output to Start Chatting"}
              </Typography>
            </Box>
          ))}

        {isApiLoading && (
          <Typography className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          gap: 1,
          width: "100%",
          borderRadius: 2,
          padding: "10px",
          display: "flex",
          position: "fixed",
          bottom: 0,
          backgroundColor: "white",
          alignItems: "center",
          borderTop: "1px solid #e485f0",
          zIndex: 1200,
        }}
      >
        <SoftButton
          variant="gradient"
          color="dark"
          sx={{
            width: "10px",
            "&:hover": {
              color: "red",
            },
          }}
          onClick={() => dispatch(resetChatData())}
        >
          <Delete />
        </SoftButton>
        <Input
          sx={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            "& .MuiInputBase-input": {
              width: "100% !important",
            },
          }}
          value={input}
          placeholder="Write your question here..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SoftButton
          variant="gradient"
          color="dark"
          style={{ borderRadius: "20px", padding: "10px 20px" }}
          onClick={handleSendButton}
        >
          Send
        </SoftButton>
      </Box>
    </Box>
  );
};

export default ChatMessage;
