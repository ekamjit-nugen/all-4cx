import React, { useEffect, useRef, useState } from "react";
import SoftBox from "components/soft-box";
import { Alert, Avatar, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SoftTypography from "components/soft-typography";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import SendIcon from "@mui/icons-material/Send";
import { CheckIcon } from "lucide-react";
import SoftInput from "components/soft-input";
import SoftButton from "components/soft-button";
import { AxiosError } from "axios";
import SoftSnackbar from "components/soft-snackbar";
import fetchData from "services/api";
import formatMarkdownParser from "utils/formatMarkdownParser";
import CircularProgress from "@mui/material/CircularProgress";
import { baseURL } from "pages/flowies/store/constant";

export default function TestSection({ widgetOptions, flow_id, activeDesignStep, active_id }) {
  const [searchResponse, setSearchResponse] = useState(null);

  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [chatbotLoader, setChatbotLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);

  const chatbotWidgetSetting = useSelector((state) => state.widgetChatbotSlice);
  const widgetSetting = useSelector((state) => state.widgetSetting);

  const [chatbotThemeConfig, setChatbotThemeConfig] = useState(chatbotWidgetSetting);
  const [widgetTheme, setWidgetTheme] = useState(widgetSetting);
  const contentWidth = activeDesignStep === 0 ? "100%" : activeDesignStep === 1 ? "70%" : "30%";
  const ref = useRef(null)
  // ! ======================== (HTTP API REQUEST) =============================
  const handleChatbotSendMessageRequest = async () => {
    try {
      setChatbotLoader(true);
      const API_URI = `${baseURL}/api/v1/prediction/${flow_id}`;

      setMessages((prev) => [...prev, { sender: "user", text: newMessage }]);

      // const response = await fetch(API_URI, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ question: newMessage }),
      // });

      // const result = await response.json();

      // const { text: responseText } = result;

      const response = await fetchData(API_URI, "POST", { question: newMessage, modelType:'widget', widgetId:active_id });

      const { text: responseText } = response;

      setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
    } catch (error) {
      if (error instanceof AxiosError) {
        const {
          response: { data },
        } = error;
        setSnakbarState({
          type: "error",
          status: true,
          message: data.message,
        });
      }
    } finally {
      setNewMessage("");
      setChatbotLoader(false);
    }
  };

  const handleSearchbarRequest = async () => {
    try {
      setSearchLoader(true);
      const API_URI = `${baseURL}/api/v1/prediction/${flow_id}`;

      const response = await fetchData(API_URI, "POST", { question: newMessage, modelType:'widget', widgetId:active_id});

      const { text: responseText } = response;

      setSearchResponse(responseText);
    } catch (error) {
      if (error instanceof AxiosError) {
        const {
          response: { data },
        } = error;
        setSnakbarState({
          type: "error",
          status: true,
          message: data.message,
        });
      }
    } finally {
      setSearchQuery("");
      setSearchLoader(false);
    }
  };

  // ! ======================== (HANDLE CHANGE) ================================
  const handleSendMessage = async () => {
    setNewMessage("")
    await handleChatbotSendMessageRequest();
  };
  useEffect(()=>{
    if(ref.current){
      ref.current.scrollTop = ref.current.scrollHeight
    }  },[messages])
  const handleGenerateFlowsDataClick = (event) => {
    if (event.key === "Enter") handleSearchbarRequest();
  };

  const handleDesignInputChange = (event) => setSearchQuery(event.target.value);

  const sectionToRender = () => {
    return widgetOptions === "search" ? (
      <Box
        id="main-render"
        sx={{
          ...transitionStyle,
          height: "95%",
          borderStyle: "dashed",
          borderWidth: 3,
          padding: 2,
          overflowY: "auto",
          marginTop: 4,
          width: widgetOptions === "search" ? contentWidth : "100%",
          marginX: "auto",
        }}
      >
        <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
          Search Bar
        </SoftTypography>

        <Box marginTop={2} marginBottom={4}>
          <SoftInput
            placeholder="Search Here ..."
            icon={{ component: "search", direction: "left" }}
            onChange={handleDesignInputChange}
            onKeyPress={handleGenerateFlowsDataClick}
          />
        </Box>

        {searchLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "25vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
              {searchResponse ? "Result" : "Given Instruction"}
            </SoftTypography>

            {searchResponse ? (
              <SoftBox
                sx={{
                  boxShadow: 3,
                  display: "flex",
                  marginTop: 2,
                  height: "auto",
                  ...transitionStyle,
                }}
              >
                <Box
                  flex={1}
                  sx={{
                    padding: 4,
                    borderLeftWidth: 6,
                    borderColor: widgetTheme.color,
                    transition: "border-color 0.3s ease-in-out",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "normal",
                      textAlign: "justify",
                      fontSize: widgetTheme.fontSize,
                      fontFamily: widgetTheme.fontFamily,
                    }}
                    variant="subtitle2"
                  >
                    <div className="message-format">
                    {formatMarkdownParser(searchResponse)}
                    </div>
                  </Typography>
                </Box>

                {activeDesignStep === 0 && (
                  <SoftBox
                    flex={2}
                    sx={{
                      backgroundColor: "#ededed",
                      borderWidth: 1,
                      padding: 2,
                      ...transitionStyle,
                    }}
                  >
                    <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
                      Reference
                    </SoftTypography>
                    <ol
                      style={{
                        listStyleType: "decimal",
                        paddingLeft: "1.5rem",
                        fontSize: widgetTheme.fontSize,
                        fontFamily: widgetTheme.fontFamily,
                      }}
                    >
                      <li>
                        <SoftTypography
                          sx={{
                            fontWeight: "normal",
                            display: "inline",
                            fontSize: widgetTheme.fontSize,
                            fontFamily: widgetTheme.fontFamily,
                          }}
                          variant="subtitle2"
                        >
                          tivei a promoção do Amazon Prime Vídeo, mas não consigo ver os conteúdos.
                        </SoftTypography>
                      </li>
                      <li>
                        <SoftTypography
                          sx={{
                            fontWeight: "normal",
                            display: "inline",
                            fontSize: widgetTheme.fontSize,
                            fontFamily: widgetTheme.fontFamily,
                          }}
                          variant="subtitle2"
                        >
                          Como ativo a subscrição Amazon Prime e todas as suas vantagens?
                        </SoftTypography>
                      </li>
                      <li>
                        <SoftTypography
                          sx={{
                            fontWeight: "normal",
                            display: "inline",
                            fontSize: widgetTheme.fontSize,
                            fontFamily: widgetTheme.fontFamily,
                          }}
                          variant="subtitle2"
                        >
                          Segui o processo de ativaçao mas o Amazon Prime ainda não está ativo, o
                          que posso fazer?
                        </SoftTypography>
                      </li>
                      <li>
                        <SoftTypography
                          sx={{
                            fontWeight: "normal",
                            display: "inline",
                            fontSize: widgetTheme.fontSize,
                            fontFamily: widgetTheme.fontFamily,
                          }}
                          variant="subtitle2"
                        >
                          Segui o processo de ativação mas o Amazon Prime ainda não está ativo, o
                          que posso fazer?
                        </SoftTypography>
                      </li>
                    </ol>
                  </SoftBox>
                )}
              </SoftBox>
            ) : (
              <SoftBox
                sx={{
                  display: "flex",
                  marginTop: 2,
                  height: "auto",
                  ...transitionStyle,
                }}
              >
                <Box
                  flex={1}
                  sx={{
                    transition: "border-color 0.3s ease-in-out",
                  }}
                >
                  <Alert severity="info">
                    Here, you can experiment with design templates using real-time data rendered
                    within the component. Simply enter a prompt in the search bar and press
                    &quot;Enter&quot; to view the results.
                  </Alert>
                </Box>
              </SoftBox>
            )}
          </>
        )}
      </Box>
    ) : widgetOptions === "chatbot" ? (
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <SoftBox sx={{ flex: 1, borderRightWidth: 1 }} shadow={"sm"}>
          {/* // ! Header Section */}
          <Box
            boxShadow={"rgba(0, 0, 0, 0.16) 0px 1px 4px;"}
            id="chatbot-header-component"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingY: 2,
              paddingX: 4,
              marginX: "auto",
              backgroundColor: chatbotThemeConfig["header-component"].backgroundColor,
            }}
          >
            <SoftTypography
              variant="subtitle"
              align="center"
              gutterBottom
              sx={{
                color: chatbotThemeConfig["header-component"].textColor,
                fontFamily: chatbotThemeConfig["header-component"].fontFamily,
              }}
            >
              Chatbot Interface
            </SoftTypography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Minimize Icon */}
              <SoftBox
                shadow={"sm"}
                sx={{
                  display: "flex",
                  height: 35,
                  width: 35,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "0.2rem",
                  cursor: "pointer",
                  background: "linear-gradient(90deg, #E5E5E5, #F8F9FA)",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#D9EAFD",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <RemoveIcon />
              </SoftBox>

              {/* Close Icon */}
              <SoftBox
                shadow={"sm"}
                sx={{
                  display: "flex",
                  height: 35,
                  width: 35,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "0.2rem",
                  cursor: "pointer",
                  background: "linear-gradient(90deg, #FFD1D1, #FFC3C3)",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#FF8A8A",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CloseIcon sx={{ color: "red" }} />
              </SoftBox>
            </Box>
          </Box>
          {/* // ! Main Rendering Part */}
          <Box
            id="main-render"
            sx={{
              ...transitionStyle,
              padding: 2,
              overflowY: "auto",
              marginTop: 4,
              marginX: "auto",
            }}
          >
            <Box
              sx={{
                height: "40vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              <Box
                ref = {ref}
                sx={{
                  height: "auto",
                  padding: 2,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {messages.map((message, index) => (
                  <SoftBox
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                      gap: 1,
                      marginTop: 1,
                    }}
                  >
                    {/* Avatar */}
                    {message.sender !== "user" && (
                      <Avatar
                        sx={{
                          backgroundColor: chatbotThemeConfig["avatar-component"].backgroundColor,
                          color: "#ffffff",
                          width: 40,
                          height: 40,
                          fontSize: "14px",
                        }}
                        variant="rounded"
                      >
                        {message.sender.charAt(0).toUpperCase() || "F"}{" "}
                      </Avatar>
                    )}

                    {/* Message container */}
                    <SoftBox
                      shadow="sm"
                      sx={{
                        borderWidth: 1,
                        maxWidth: "70%",
                        paddingX: 4,
                        paddingY: 1,
                        background:
                          message.sender === "user"
                            ? chatbotThemeConfig["message-container-component"].backgroundColor
                            : "white",
                        borderRadius: 2,
                        textAlign: message.sender === "user" ? "right" : "left",
                      }}
                    >
                      {/* Message Text */}
                      <SoftTypography
                        variant="subtitle2"
                        color={"black"}
                        sx={{
                          color: chatbotThemeConfig["message-container-component"].textColor,
                          fontFamily: chatbotThemeConfig["message-container-component"].fontFamily,
                        }}
                      >
                        <div className="message-format">
                        {formatMarkdownParser(message.text)}
                        </div>
                      </SoftTypography>

                      {/* Time and Tick */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                          marginTop: 0.5,
                          gap: 0.5,
                        }}
                      >
                        {/* Time */}
                        <SoftTypography variant="caption" color={"black"}>
                          {message.time || "12:00 PM"} {/* Replace with actual time */}
                        </SoftTypography>

                        {/* Tick Icon */}
                        {message.sender === "user" && (
                          <CheckIcon
                            sx={{
                              fontSize: 16,
                              color: message.isRead ? "#34c759" : "#e0e0e0", // Green for read, gray for sent
                            }}
                          />
                        )}
                      </Box>
                    </SoftBox>
                  </SoftBox>
                ))}
                {chatbotLoader && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          {/* // ! Input Section */}
          <Box
            id="chatbot-header-component"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingY: 2,
              paddingX: 4,
              marginX: "auto",
              gap: 2,
              borderWidth: 1,
            }}
          >
            <Box width={"100%"}>
              <SoftInput
                value = {newMessage}
                placeholder="Type a message..."
                icon={{ component: "message", direction: "left" }}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
            </Box>

            <SoftButton
              sx={{
                gap: 0.5,
                backgroundColor: chatbotThemeConfig["send-button-component"].backgroundColor,
              }}
              onClick={handleSendMessage}
              size="medium"
              iconOnly={true}
            >
              <SendIcon color="white" />
            </SoftButton>
          </Box>
        </SoftBox>
      </Box>
    ) : null;
  };

  const handleSnackBarClose = () => {
    setSnakbarState({
      type: "",
      status: false,
      message: "",
    });
  };

  const transitionStyle = {
    transition: "width 0.5s ease-in-out, transform 0.5s",
  };

  return (
    <SoftBox
      sx={{
        height: "calc(100% - 230px)",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {sectionToRender()}
      <SoftSnackbar
        color={snakbarState.type}
        icon="check_circle"
        title={snakbarState.type === "success" ? "Success!" : "Something went wrong!"}
        content={snakbarState.message}
        close={handleSnackBarClose}
        open={snakbarState.status}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={handleSnackBarClose}
      />
    </SoftBox>
  );
}
