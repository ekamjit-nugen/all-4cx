import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  IconButton,
  Avatar,
} from "@mui/material";
import SoftButton from "components/soft-button";
import SoftInput from "components/soft-input";
import SoftTypography from "components/soft-typography";
import SoftBox from "components/soft-box";
import { ColorLens, Add, Remove } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import { componentModifyType, themeFonts } from "../../constants/theme";
import SoftSelect from "components/soft-select";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setThemeColor } from "store/features/widgetSettingsSlice";
import { setFontSize } from "store/features/widgetSettingsSlice";
import { setFontFamily } from "store/features/widgetSettingsSlice";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import SendIcon from "@mui/icons-material/Send";
import { CheckIcon } from "lucide-react";
import { updateComponentConfig } from "store/features/widgetChatbotSlice";

export default function WebUISection({
  widgetOptions,
  activeDesignStep,
  setActiveDesignStep,
  selectedDesign,
  handleSelectComponentDesign,
  handleDesignInputChange,
  handleGenerateFlowsDataClick,
  dummyPrompt,
  widgetTheme,
  setWidgetTheme
}) {
  const widgetSetting = useSelector((state) => state.widgetSetting);

  const [showPicker, setShowPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBGColorPicker, setShowBGColorPicker] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
    { sender: "user", text: "I need some help with React." },
    { sender: "bot", text: "Sure, please mention the exact thing." },
    { sender: "user", text: "Can you explain the life cycle methods" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeModifyComponentType, setActiveModifyComponentType] = useState("header-component");

  const chatbotWidgetSetting = useSelector((state) => state.widgetChatbotSlice);

  const [chatbotThemeConfig, setChatbotThemeConfig] = useState(chatbotWidgetSetting);

  const pickerRef = useRef(null);
  const chatbotTextColorRef = useRef(null);
  const chatbotBGColorRef = useRef(null);
  const ref = useRef(null)

  const dispatch = useDispatch();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "user", text: newMessage }]);
      setNewMessage("");
    }
  };

  const handleNextClick = () => {
    if (activeDesignStep >= 2) return;
    setActiveDesignStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePreviousClick = () => {
    if (activeDesignStep === 0) return;
    setActiveDesignStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(()=>{
    if(ref.current){
      ref.current.scrollTop = ref.current.scrollHeight
    }
  },[messages])

  // ! =============================== (SEARCH-COMPONENT HANDLE CHANGE + HANDLE SUBMIT) ==================================
  const increaseFontSize = () => {
    setWidgetTheme((prev) => {
      const updatedUnit = prev.fontSize + 2;
      // dispatch(updateComponentConfig('header-component',{fontSize:`${updatedUnit}px`}));
      dispatch(
        updateComponentConfig({
          component: activeModifyComponentType,
          config: { fontSize: `${updatedUnit}px` },
        })
      );
      dispatch(setFontSize(updatedUnit));
      setChatbotThemeConfig((prev) => ({
        ...prev,
        [activeModifyComponentType]: {
          ...prev[activeModifyComponentType],
          fontSize: `${updatedUnit}px`,
        },
      }));
      return {
        ...prev,
        fontSize: `${updatedUnit}px`,
      };
    });
  };
  
  const decreaseFontSize = () => {
    setWidgetTheme((prev) => {
      const updatedUnit = prev.fontSize > 2 ? prev.fontSize - 2 : prev.fontSize;
      dispatch(
        updateComponentConfig({
          component: activeModifyComponentType,
          config: { fontSize: `${updatedUnit}px` },
        })
      );
      setChatbotThemeConfig((prev) => ({
        ...prev,
        [activeModifyComponentType]: {
          ...prev[activeModifyComponentType],
          fontSize: `${updatedUnit}px`,
        },
      }));
      dispatch(setFontSize(updatedUnit));
      return {
        ...prev,
        fontSize: `${updatedUnit}px`,
      };
    });
  };

  const togglePicker = () => setShowPicker((prev) => !prev);
  const toggleTextPicker = () => setShowTextColorPicker((prev) => !prev);
  const toggleBGPicker = () => setShowBGColorPicker((prev) => !prev);

  const changeColor = (newColor) => {
    const parsedColor = newColor.hex;
    setWidgetTheme((prev) => ({
      ...prev,
      color: parsedColor,
    }));
    dispatch(setThemeColor(parsedColor));
  };

  const handleFontChange = (parsedVal) => {
    const { label, value } = parsedVal;
    dispatch(setFontFamily(value));
    setWidgetTheme((prev) => ({
      ...prev,
      fontFamily: value,
    }));
  };

  // ! =============================== (CHATBOT-COMPONENT HANDLE CHANGE + HANDLE SUBMIT) ==================================

  const changeBackgroundColorChange = (newColor) => {
    const parsedColor = newColor.hex;
    setChatbotThemeConfig((prev) => ({
      ...prev,
      [activeModifyComponentType]: {
        ...prev[activeModifyComponentType],
        backgroundColor: parsedColor,
      },
    }));
    // setting in redux
    dispatch(
      updateComponentConfig({
        component: activeModifyComponentType,
        config: { backgroundColor: parsedColor },
      })
    );
  };

  const changeTextColorChange = (newColor) => {
    const parsedColor = newColor.hex;
    setChatbotThemeConfig((prev) => ({
      ...prev,
      [activeModifyComponentType]: {
        ...prev[activeModifyComponentType],
        textColor: parsedColor,
      },
    }));
    // setting in redux
    dispatch(
      updateComponentConfig({
        component: activeModifyComponentType,
        config: { textColor: parsedColor },
      })
    );
  };

  const handleChatbotFontChange = (parsedVal) => {
    const { label, value } = parsedVal;
    setChatbotThemeConfig((prev) => ({
      ...prev,
      [activeModifyComponentType]: {
        ...prev[activeModifyComponentType],
        fontFamily: value,
      },
    }));
    // setting in redux
    dispatch(
      updateComponentConfig({
        component: activeModifyComponentType,
        config: { fontFamily: value },
      })
    );
  };

  const handleSlectComponentModifyChatbot = (parsedVal) => {
    const { label, value } = parsedVal;
    setActiveModifyComponentType(value);
  };

  // ! =============================== (TRANSITIONAL CHANGE) ==================================

  const contentWidth = activeDesignStep === 0 ? "100%" : activeDesignStep === 1 ? "70%" : "30%";
  const transitionStyle = {
    transition: "width 0.5s ease-in-out, transform 0.5s",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }

      if (chatbotTextColorRef.current && !chatbotTextColorRef.current.contains(event.target)) {
        setShowTextColorPicker(false);
      }

      if (chatbotBGColorRef.current && !chatbotBGColorRef.current.contains(event.target)) {
        setShowBGColorPicker(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Initialize widget theme with settings if available
    if (widgetSetting) {
      setWidgetTheme({
        color: widgetSetting.themeColor,
        fontFamily: widgetSetting.fontFamily,
        fontSize: widgetSetting.fontSize,
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetSetting]);

  const sectionToRender = () => {
    return widgetOptions === "search" ? (
      <>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle">
            Search Component Preview
          </SoftTypography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* // ! ====================== (TEXT FONT) =====================  */}
              <SoftSelect
                defaultValue={{ value: "Select Font", label: "Select Font" }}
                value={{ value: widgetTheme.fontFamily, label: widgetTheme.fontFamily }}
                options={themeFonts}
                onChange={handleFontChange}
              />

              {/* // ! ====================== (TEXT SIZE) =====================  */}
              <IconButton onClick={decreaseFontSize} aria-label="decrease font size">
                <Remove />
              </IconButton>
              <SoftTypography style={{ fontSize: "15px", margin: "0 10px" }}>
                <strong>Size:</strong> {widgetTheme.fontSize}px
              </SoftTypography>
              <IconButton onClick={increaseFontSize} aria-label="increase font size">
                <Add />
              </IconButton>
            </div>
            {/* // ! ====================== (THEME TOGGLE TOOL) =====================  */}
            <IconButton sx={{ boxShadow: 4 }} onClick={togglePicker}>
              <ColorLens sx={{ color: widgetTheme.color }} />
            </IconButton>
            {showPicker && (
              <div
                ref={pickerRef}
                style={{ position: "absolute", top: "100%", zIndex: 1, marginTop: 10 }}
              >
                <SketchPicker color={widgetTheme.color} onChangeComplete={changeColor} />
              </div>
            )}
            {/* // ! ====================== (SELECT DESIGN) =====================  */}
            <SoftButton
              onClick={handleSelectComponentDesign}
              variant="gradient"
              color="dark"
              size="medium"
            >
              Select Design
            </SoftButton>
          </Box>
        </Box>

        {/* Main Rendering Part */}
        <Box
          id="main-render"
          sx={{
            ...transitionStyle,
            height: "95%",
            borderStyle: "dashed",
            borderColor: selectedDesign === activeDesignStep ? "blue" : "grey",
            borderWidth: 3,
            padding: 2,
            overflowY: "auto",
            marginTop: 4,
            width: contentWidth,
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

          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            {dummyPrompt ? "Result" : "Given Instruction"}
          </SoftTypography>

          {dummyPrompt ? (
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
                  Raw denim you probably haven&apos;t heard of them jean shorts Austin. Nesciunt
                  tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor,
                  williamsburg carles vegan helvetica.
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
                        Segui o processo de ativaçao mas o Amazon Prime ainda não está ativo, o que
                        posso fazer?
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
                        Segui o processo de ativação mas o Amazon Prime ainda não está ativo, o que
                        posso fazer?
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
                  Here, you can experiment with design templates using realtime data rendered within
                  the component. Simply enter a prompt in the search bar and press &quot;Enter&quot;
                  to view the results.
                </Alert>
              </Box>
            </SoftBox>
          )}
        </Box>

        {/* <SketchPicker color={"red"} onChangeComplete={(color) => changeColor(color.hex)} /> */}

        {/* Stepper Component */}
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <Stepper activeStep={activeDesignStep} alternativeLabel>
            {["Step 1", "Step 2", "Step 3"].map((label) => (
              <Step key={label}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {activeDesignStep > 0 && (
            <SoftButton
              onClick={handlePreviousClick}
              variant="gradient"
              color="light"
              size="medium"
            >
              Previous
            </SoftButton>
          )}
          <SoftButton onClick={handleNextClick} variant="gradient" color="light" size="medium">
            Next Design
          </SoftButton>
        </Box>
      </>
    ) : widgetOptions === "chatbot" ? (
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <SoftBox sx={{ flex: 2.5, borderRightWidth: 1 }} shadow={"sm"}>
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
                fontSize: chatbotThemeConfig["header-component"].fontSize
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
              ref={ref}
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
                        paddingX: 2,
                        paddingY: 1,
                        background:
                          message.sender === "user"
                            ? chatbotThemeConfig["message-container-component"].backgroundColor
                            : chatbotThemeConfig["bot-message-container"].backgroundColor,
                        borderRadius: 2,
                        textAlign: message.sender === "user" ? "right" : "left",
                      }}
                    >
                      {/* Message Text */}
                      <SoftTypography
                        variant="subtitle2"
                        color={"black"}
                        sx={{
                          color: message.sender === "user" ? chatbotThemeConfig["message-container-component"].textColor : chatbotThemeConfig["bot-message-container"].textColor ,
                          fontFamily: message.sender === "user" ? chatbotThemeConfig["message-container-component"].fontFamily : chatbotThemeConfig["bot-message-container"].fontFamily,
                          fontSize: message.sender === "user" ? chatbotThemeConfig["message-container-component"].fontSize : chatbotThemeConfig["bot-message-container"].fontSize
                        }}
                      >
                        {message.text}
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
                value={newMessage}
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
        <SoftBox sx={{ flex: 1.5 }}>
          <SoftBox
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 3,
              height: "auto",
              borderWidth: 1,
              borderRadius: 1,
              padding: 4,
            }}
            shadow={"sm"}
          >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
              <SoftTypography variant="subtitle2" sx={{ fontWeight: 700, color: "black" }}>
                Choose component type
              </SoftTypography>
              <SoftSelect
                name="widgetSource"
                defaultValue={{ value: "Select Category", label: "Select Category" }}
                value={{
                  label: componentModifyType.find(
                    (item) => activeModifyComponentType === item.value
                  ).label,
                  value: componentModifyType.find(
                    (item) => activeModifyComponentType === item.value
                  ).value,
                }}
                options={componentModifyType}
                onChange={handleSlectComponentModifyChatbot}
                fullWidth
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
                InputProps={{
                  style: { fontSize: "16px", padding: "12px" },
                }}
              />
            </Box>

            {/* //! FONT FAMILY */}

            {activeModifyComponentType === "avatar-component" ||
            activeModifyComponentType === "send-button-component" ||
            activeModifyComponentType === "bot-message-container" ? null : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  marginTop: 2,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <SoftTypography variant="subtitle2" sx={{ fontWeight: 700, color: "black" }}>
                  Configure Font Family
                </SoftTypography>
                <SoftSelect
                  name="widgetSource"
                  defaultValue={{ value: "Select Category", label: "Select Category" }}
                  value={{
                    label: chatbotThemeConfig[activeModifyComponentType].fontFamily,
                    value: chatbotThemeConfig[activeModifyComponentType].fontFamily,
                  }}
                  options={themeFonts}
                  onChange={handleChatbotFontChange}
                  fullWidth
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputProps={{
                    style: { fontSize: "16px", padding: "12px" },
                  }}
                />
              </Box>
            )}

            {/* //! TEXT SIZE */}

            {activeModifyComponentType === "avatar-component" ||
            activeModifyComponentType === "send-button-component" ? null : (
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center", marginTop: 2, gap: 2 }}
              >
                <IconButton onClick={decreaseFontSize} aria-label="decrease font size">
                  <Remove />
                </IconButton>
                <SoftTypography style={{ fontSize: "15px", margin: "0 10px" }}>
                  <strong>Size:</strong> {chatbotThemeConfig[activeModifyComponentType].fontSize}
                </SoftTypography>
                <IconButton onClick={increaseFontSize} aria-label="increase font size">
                  <Add />
                </IconButton>
              </Box>
            )}

            {/* //! TEXT COLOR - colorpicker */}

            {activeModifyComponentType === "avatar-component" ||
            activeModifyComponentType === "send-button-component" ? null : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  marginTop: 2,
                  gap: 2,
                }}
              >
                <SoftTypography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "black", flex: 2 }}
                >
                  Text Color
                </SoftTypography>
                <SoftTypography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "gray", flex: 1, textAlign: "center" }}
                >
                  {chatbotThemeConfig[activeModifyComponentType].textColor}
                </SoftTypography>
                <Box sx={{ flex: 1, textAlign: "right", position: "relative" }}>
                  <IconButton sx={{ boxShadow: 4 }} onClick={toggleTextPicker}>
                    <ColorLens
                      sx={{
                        color: chatbotThemeConfig[activeModifyComponentType].textColor,
                      }}
                    />
                  </IconButton>
                  {showTextColorPicker && (
                    <div
                      ref={chatbotTextColorRef}
                      style={{
                        position: "absolute",
                        zIndex: 10,
                        marginTop: 10,
                        top: "100%",
                        left:
                          chatbotTextColorRef.current &&
                          chatbotTextColorRef.current.getBoundingClientRect().right + 250 >
                            window.innerWidth
                            ? "auto" // Switch to positioning from the right
                            : 0, // Default left alignment
                        right:
                          chatbotTextColorRef.current &&
                          chatbotTextColorRef.current.getBoundingClientRect().right + 250 >
                            window.innerWidth
                            ? 0
                            : "auto",
                      }}
                    >
                      <SketchPicker
                        color={chatbotThemeConfig[activeModifyComponentType].textColor}
                        onChangeComplete={changeTextColorChange}
                      />
                    </div>
                  )}
                </Box>
              </Box>
            )}

            {/* //! BACKGROUND COLOR - colorpicker */}

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                marginTop: 2,
                gap: 2,
              }}
            >
              <SoftTypography variant="subtitle2" sx={{ fontWeight: 700, color: "black", flex: 2 }}>
                Background Color
              </SoftTypography>
              <SoftTypography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "gray", flex: 1, textAlign: "center" }}
              >
                {chatbotThemeConfig[activeModifyComponentType].backgroundColor}
              </SoftTypography>
              <Box sx={{ flex: 1, textAlign: "right", position: "relative" }}>
                <IconButton sx={{ boxShadow: 4 }} onClick={toggleBGPicker}>
                  <ColorLens
                    sx={{
                      color: chatbotThemeConfig[activeModifyComponentType].backgroundColor,
                    }}
                  />
                </IconButton>
                {showBGColorPicker && (
                  <div
                    ref={chatbotBGColorRef}
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      marginTop: 10,
                      top: "100%",
                      left:
                        chatbotBGColorRef.current &&
                        chatbotBGColorRef.current.getBoundingClientRect().right + 250 >
                          window.innerWidth
                          ? "auto" // Switch to positioning from the right
                          : 0, // Default left alignment
                      right:
                        chatbotBGColorRef.current &&
                        chatbotBGColorRef.current.getBoundingClientRect().right + 250 >
                          window.innerWidth
                          ? 0 // Align to the right edge if overflow happens
                          : "auto",
                    }}
                  >
                    <SketchPicker
                      color={chatbotThemeConfig[activeModifyComponentType].backgroundColor}
                      onChangeComplete={changeBackgroundColorChange}
                    />
                  </div>
                )}
              </Box>
            </Box>
          </SoftBox>
        </SoftBox>
      </Box>
    ) : (
      <></>
    );
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
    </SoftBox>
  );
}
