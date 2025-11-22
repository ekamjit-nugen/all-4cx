import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";
import { frameworkAssetList } from "../../constants";
import SoftButton from "components/soft-button";
import { Clipboard } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { prism as lightTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { nodePackage, nonUserSnippet } from "../../constants/code-snippets";
import { generateCodeSnippet } from "utils/generateWidgetConfigCode";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { generateChatbotWidgetSnippet } from "utils/generateChatbotWidgetSnippet";

export default function WidgetInstallConfigurations({
  widgetOptions,
  currentActiveWidgetId,
  selectedFramework,
  handleFrameworkSelect,
  selectedUserType,
  handleUserTypeSelect,
  userApiKey,
  handleGeneateAPIKeyRequest,
  setSnakbarState,
  flow_id,
  publishStatus,
  searchConfig
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { userId } = useAuth();

  const widgetSetting = useSelector((state) => state.widgetSetting);
  const chatbotWidgetSetting = useSelector((state) => state.widgetChatbotSlice);

  const generateChatThemeConfigSnippet = (themeConfigObject) => {
    return JSON.stringify(themeConfigObject, null, 2); // Generate snippet from Redux state
  };

  const shopifyValues = [
    {
      title: "User Id",
      value: userId || "",
    },
    {
      title: "Widget Id",
      value: currentActiveWidgetId || "",
    },
    {
      title: "Flowise Id",
      value: flow_id || "",
    },
  ];

  const handleCopy = (val) => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    setSnakbarState({
      type: "success",
      status: true,
      message: "Copied to clipboard!",
    });
  };

  return (
    <Box
      padding={3}
      sx={{
        height: "90%",
        width: "100%",
        backgroundColor: "white",
        overflowY: "scroll",
      }}
      shadow={"sm"}
      borderRadius={"lg"}
    >
      {currentActiveWidgetId ? (
        <SoftBox
          sx={{
            backgroundColor: publishStatus ? "#b0ffdd" : "#ffb0bc",
            padding: 2,
            marginBottom: 2,
          }}
          borderRadius={"lg"}
          shadow={"sm"}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            {publishStatus ? (
              <CheckCircleOutlineIcon fontSize={"medium"} />
            ) : (
              <ErrorOutlineIcon fontSize={"medium"} />
            )}

            <SoftTypography variant="subtitle" sx={{ fontWeight: "bold" }}>
              {publishStatus ? "Good to go!" : "Oops! Not yet published"}
            </SoftTypography>
          </Box>
          <Typography variant="subtitle2">
            {publishStatus
              ? "Your widget is now published and available for use. Users can access and interact with it in their dashboards. Remember, any future updates will require re-publishing to take effect"
              : "Your widget is currently unpublished. Users won&apos;t be able to see or interact with it until you publish it. Remember to review and test your widget before making it live."}
          </Typography>
        </SoftBox>
      ) : null}

      <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle">
        01. How do you want to install the widget?
      </SoftTypography>
      <Grid container spacing={2} marginTop={2} marginBottom={4}>
        {frameworkAssetList.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={item.id}>
            <SoftBox
              onClick={() => handleFrameworkSelect(item.altName)}
              shadow={"sm"}
              borderRadius={"lg"}
              style={{
                backgroundColor: item.altName === selectedFramework ? "#e3e6ff" : "",
                height: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <img
                src={`/widget-configuration/${item.iconName}.svg`}
                width={20}
                alt={item.frameworkName}
              />
              <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
                {item.frameworkName}
              </SoftTypography>
            </SoftBox>
          </Grid>
        ))}
      </Grid>
      <SoftTypography sx={{ fontWeight: "bold", marginTop: 4 }} variant="subtitle">
        02. Install 4CX in your{" "}
        {selectedFramework
          ? frameworkAssetList.find((f) => f.altName === selectedFramework).frameworkName
          : "React"}{" "}
        application?
      </SoftTypography>

      {/* <SoftBox
        shadow={"sm"}
        borderRadius={"lg"}
        marginY={2}
        sx={{ display: "flex", borderWidth: 2 }}
        padding={0.5}
      >
        <SoftBox
          sx={{ backgroundColor: selectedUserType === "login" ? "#f2f2f2" : "" }}
          onClick={() => handleUserTypeSelect("login")}
          borderRadius={"lg"}
          flex={1}
          padding={2}
          style={{ cursor: "pointer" }}
        >
          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            For users with logins
          </SoftTypography>
          <SoftTypography sx={{ marginTop: 1, fontWeight: "normal" }} variant="subtitle2">
            Choose to install 4CX on a site or app for users who log in.
          </SoftTypography>
        </SoftBox>
        <SoftBox
          sx={{ backgroundColor: selectedUserType === "visitor" ? "#f2f2f2" : "" }}
          onClick={() => handleUserTypeSelect("visitor")}
          borderRadius={"lg"}
          flex={1}
          padding={2}
          style={{ cursor: "pointer" }}
        >
          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            For website visitors without login
          </SoftTypography>
          <SoftTypography sx={{ marginTop: 1, fontWeight: "normal" }} variant="subtitle2">
            Choose to install 4CX on a site or app for non-logged-in users.
          </SoftTypography>
        </SoftBox>
      </SoftBox> */}

      {/* // ! ===================== 2. Install 4CX in your Code Snippet application =======================*/}

      <SoftTypography
        sx={{ marginTop: 2, marginBottom: 2, fontWeight: "light" }}
        variant="subtitle2"
      >
        Add fourcx widget to your project using the following snippet
      </SoftTypography>

      {selectedUserType === "login" ? (
        <>
          <SoftBox
            shadow={"sm"}
            borderRadius={"lg"}
            sx={{ position: "relative", mb: 2, borderRadius: 1, overflow: "hidden" }}
          >
            <CopyToClipboard text={nodePackage} onCopy={handleCopy}>
              <SoftButton
                variant="contained"
                color="dark"
                sx={{
                  height: 20,
                  width: 20,
                  position: "absolute",
                  top: 8,
                  right: 8,
                  textTransform: "none",
                  zIndex: 1,
                }}
              >
                <Clipboard />
              </SoftButton>
            </CopyToClipboard>
            <SyntaxHighlighter
              language={"bash"}
              style={lightTheme}
              customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
            >
              {nodePackage}
            </SyntaxHighlighter>
          </SoftBox>

          <SoftTypography sx={{ marginTop: 4, fontWeight: "light" }} variant="subtitle2">
            Add API keys to your configuration.
          </SoftTypography>

          {userApiKey.status ? (
            <SoftBox
              shadow={"sm"}
              borderRadius={"lg"}
              sx={{ marginY: 2, position: "relative", borderRadius: 1, overflow: "hidden" }}
            >
              <CopyToClipboard text={userApiKey.key} onCopy={handleCopy}>
                <SoftButton
                  variant="contained"
                  color="dark"
                  sx={{
                    height: 20,
                    width: 20,
                    position: "absolute",
                    top: 8,
                    right: 8,
                    textTransform: "none",
                    zIndex: 1,
                  }}
                >
                  <Clipboard />
                </SoftButton>
              </CopyToClipboard>
              <SyntaxHighlighter
                language={"bash"}
                style={lightTheme}
                customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
              >
                {userApiKey.key}
              </SyntaxHighlighter>
            </SoftBox>
          ) : (
            <></>
          )}

          <SoftButton
            onClick={handleGeneateAPIKeyRequest}
            sx={{ marginY: 1 }}
            size="medium"
            variant="gradient"
            color="dark"
          >
            {userApiKey.status ? "Regenerate API Key" : "Generate API Key"}
          </SoftButton>
          {(widgetOptions === "chatbot" || "search") &&
            selectedFramework === "shopify" &&
            shopifyValues.map((value) => {
              return (
                <>
                  {value?.value && (
                    <SoftTypography sx={{ marginTop: 4, fontWeight: "light" }} variant="subtitle2">
                      {value?.title}
                    </SoftTypography>
                  )}
                  {value?.value && (
                    <SoftBox
                      shadow={"sm"}
                      borderRadius={"lg"}
                      sx={{ position: "relative", mb: 2, borderRadius: 1, overflow: "hidden" }}
                    >
                      <CopyToClipboard text={value?.value} onCopy={handleCopy}>
                        <SoftButton
                          variant="contained"
                          color="dark"
                          sx={{
                            height: 20,
                            width: 20,
                            position: "absolute",
                            top: 8,
                            right: 8,
                            textTransform: "none",
                            zIndex: 1,
                          }}
                        >
                          <Clipboard />
                        </SoftButton>
                      </CopyToClipboard>
                      <SyntaxHighlighter
                        language={"bash"}
                        style={lightTheme}
                        customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
                      >
                        {value?.value}
                      </SyntaxHighlighter>
                    </SoftBox>
                  )}
                </>
              );
            })}

          {/* // ! =================================== THEME SNIPPET FOR CHATBOT ====================================== */}
          {(widgetOptions === "chatbot" || "search") && selectedFramework !== "shopify" ? (
            <>
              <SoftTypography sx={{ marginY: 4, fontWeight: "light" }} variant="subtitle2">
                Theme Configuration
              </SoftTypography>
              <SoftBox
                shadow={"sm"}
                borderRadius={"lg"}
                sx={{ position: "relative", mb: 2, borderRadius: 1, overflow: "hidden" }}
              >
                <CopyToClipboard
                  text={ widgetOptions === 'chatbot' ? generateChatThemeConfigSnippet(chatbotWidgetSetting) : generateChatThemeConfigSnippet(searchConfig)}
                  onCopy={handleCopy}
                >
                  <SoftButton
                    variant="contained"
                    color="dark"
                    sx={{
                      height: 20,
                      width: 20,
                      position: "absolute",
                      top: 8,
                      right: 8,
                      textTransform: "none",
                      zIndex: 1,
                    }}
                  >
                    <Clipboard />
                  </SoftButton>
                </CopyToClipboard>
                <SyntaxHighlighter
                  language={"javascript"}
                  style={lightTheme}
                  customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
                  showLineNumbers
                >
                  {widgetOptions === 'chatbot' ? generateChatThemeConfigSnippet(chatbotWidgetSetting) : generateChatThemeConfigSnippet(searchConfig)}
                </SyntaxHighlighter>
              </SoftBox>
            </>
          ) : (
            <></>
          )}

          {/* // ! =================================== MAIN COMPONENT SNIPPET ====================================== */}

          {!((widgetOptions === "chatbot" || "search") && selectedFramework === "shopify") && (
            <SoftTypography sx={{ marginY: 4, fontWeight: "light" }} variant="subtitle2">
              To initialize 4CX, copy and paste this code snippet on every page or in a common
              component where you want the messenger to appear. This must be done in your client
              side code.
            </SoftTypography>
          )}

          {!((widgetOptions === "chatbot" || "search") && selectedFramework === "shopify") && (
            <SoftBox
              shadow={"sm"}
              borderRadius={"lg"}
              sx={{ position: "relative", mb: 2, borderRadius: 1, overflow: "hidden" }}
            >
              <CopyToClipboard
                text={
                  widgetOptions === "search"
                    ? generateCodeSnippet(
                        selectedFramework,
                        widgetSetting.fontSize,
                        widgetSetting.fontFamily,
                        widgetSetting.themeColor,
                        widgetSetting.variant === 1
                          ? "700px"
                          : widgetSetting.variant === 2
                          ? "500px"
                          : widgetSetting.variant === 3
                          ? "400px"
                          : "700px",
                        userId,
                        "generated_api_key",
                        currentActiveWidgetId,
                        flow_id,
                        widgetSetting.variant
                      )
                    : widgetOptions === "chatbot"
                    ? generateChatbotWidgetSnippet(
                        selectedFramework,
                        userId,
                        "generated_api_key",
                        currentActiveWidgetId,
                        flow_id
                      )
                    : ""
                }
                onCopy={handleCopy}
              >
                <SoftButton
                  variant="contained"
                  color="dark"
                  sx={{
                    height: 20,
                    width: 20,
                    position: "absolute",
                    top: 8,
                    right: 8,
                    textTransform: "none",
                    zIndex: 1,
                  }}
                >
                  <Clipboard />
                </SoftButton>
              </CopyToClipboard>
              <SyntaxHighlighter
                language={"javascript"}
                style={lightTheme}
                customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
                showLineNumbers
              >
                {widgetOptions === "search"
                  ? generateCodeSnippet(
                      selectedFramework,
                      widgetSetting.fontSize,
                      widgetSetting.fontFamily,
                      widgetSetting.themeColor,
                      widgetSetting.variant === 1
                        ? "700px"
                        : widgetSetting.variant === 2
                        ? "500px"
                        : widgetSetting.variant === 3
                        ? "400px"
                        : "700px",
                      userId,
                      "generated_api_key",
                      currentActiveWidgetId,
                      flow_id,
                      widgetSetting.variant
                    )
                  : widgetOptions === "chatbot"
                  ? generateChatbotWidgetSnippet(
                      selectedFramework,
                      userId,
                      "generated_api_key",
                      currentActiveWidgetId,
                      flow_id
                    )
                  : "Select a framework to view its code snippet."}
              </SyntaxHighlighter>
            </SoftBox>
          )}
        </>
      ) : (
        <SoftBox
          shadow={"sm"}
          borderRadius={"lg"}
          sx={{ position: "relative", mb: 2, borderRadius: 1, overflow: "hidden" }}
        >
          <CopyToClipboard text={nonUserSnippet.react} onCopy={handleCopy}>
            <SoftButton
              variant="contained"
              color="dark"
              sx={{
                height: 20,
                width: 20,
                position: "absolute",
                top: 8,
                right: 8,
                textTransform: "none",
                zIndex: 1,
              }}
            >
              <Clipboard />
            </SoftButton>
          </CopyToClipboard>
          <SyntaxHighlighter
            language={"javascript"}
            style={lightTheme}
            customStyle={{ margin: 0, padding: "1rem", borderRadius: 4, fontSize: 16 }}
            showLineNumbers
          >
            {nonUserSnippet.react}
          </SyntaxHighlighter>
        </SoftBox>
      )}

      {/* // ! ===================== 3. Verify Installation =======================*/}
      {/* <SoftTypography sx={{ marginTop: 6, fontWeight: "bold" }} variant="subtitle">
        03. Verify Installation
      </SoftTypography>
      <SoftTypography sx={{ marginTop: 1, fontWeight: "light" }} variant="subtitle2">
        Visit any page with the Search bar installed. The search will appear in the location where
        you ve put the React snippet.
      </SoftTypography>
      <SoftButton sx={{ marginY: 4 }} size="large" variant="gradient" color="dark">
        Check Installation
      </SoftButton>
      <SoftTypography sx={{ marginTop: 1, fontWeight: "light" }} variant="subtitle2">
        By publishing the Search Widget, you agree to the 4CX Product Privacy Notice.
      </SoftTypography> */}
    </Box>
  );
}
