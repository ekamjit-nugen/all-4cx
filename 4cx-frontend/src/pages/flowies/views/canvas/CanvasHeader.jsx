import PropTypes from "prop-types";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Button } from "@mui/material";

// icons
import {
  IconSettings,
  IconChevronLeft,
  IconDeviceFloppy,
  IconPencil,
  IconCheck,
  IconX,
  IconCode,
  IconPlus,
} from "@tabler/icons-react";

// project imports
import Settings from "@/views/settings";
import SaveChatflowDialog from "@/ui-component/dialog/SaveChatflowDialog";
import APICodeDialog from "@/views/chatflows/APICodeDialog";
import ViewMessagesDialog from "@/ui-component/dialog/ViewMessagesDialog";
import ChatflowConfigurationDialog from "@/ui-component/dialog/ChatflowConfigurationDialog";
import UpsertHistoryDialog from "@/views/vectorstore/UpsertHistoryDialog";

// API
import chatflowsApi from "@/api/chatflows";

// Hooks
import useApi from "@/hooks/useApi";

// utils
import { generateExportFlowData } from "@/utils/genericHelper";
import { uiBaseURL } from "@/store/constant";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
  SET_CHATFLOW,
} from "@/store/actions";
import ViewLeadsDialog from "@/ui-component/dialog/ViewLeadsDialog";
import ExportAsTemplateDialog from "@/ui-component/dialog/ExportAsTemplateDialog";
import { StyledButton } from "pages/flowies/ui-component/button/StyledButton";
import OrganizationLevel from "pages/flowies/ui-component/dialog/OrganizationLevel";

// ==============================|| CANVAS HEADER ||============================== //

const CanvasHeader = ({
  chatflow,
  isAgentCanvas,
  handleSaveFlow,
  handleDeleteFlow,
  handleLoadFlow,
  canvasDataStore={}
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flowNameRef = useRef();
  const settingsRef = useRef();

  const [isEditingFlowName, setEditingFlowName] = useState(null);
  const [flowName, setFlowName] = useState("");
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);
  const [apiDialogOpen, setAPIDialogOpen] = useState(false);
  const [apiDialogProps, setAPIDialogProps] = useState({});
  const [viewMessagesDialogOpen, setViewMessagesDialogOpen] = useState(false);
  const [viewMessagesDialogProps, setViewMessagesDialogProps] = useState({});
  const [viewLeadsDialogOpen, setViewLeadsDialogOpen] = useState(false);
  const [viewLeadsDialogProps, setViewLeadsDialogProps] = useState({});
  const [upsertHistoryDialogOpen, setUpsertHistoryDialogOpen] = useState(false);
  const [upsertHistoryDialogProps, setUpsertHistoryDialogProps] = useState({});
  const [chatflowConfigurationDialogOpen, setChatflowConfigurationDialogOpen] = useState(false);
  const [chatflowConfigurationDialogProps, setChatflowConfigurationDialogProps] = useState({});

  const [exportAsTemplateDialogOpen, setExportAsTemplateDialogOpen] = useState(false);
  const [exportAsTemplateDialogProps, setExportAsTemplateDialogProps] = useState({});
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  const title = isAgentCanvas ? "Agents" : "Chatflow";

  const updateChatflowApi = useApi(chatflowsApi.updateChatflow);
  const canvas = useSelector((state) => state.canvas);
  const chatid=window.location.pathname.split("/").pop()
  const [isOrgLevel,setIsOrgLevel] = useState(false)
  const [orgLevelModal,setOrgLevelModal]=useState(false)

  const onSettingsItemClick = (setting) => {
    setSettingsOpen(false);

    if (setting === "deleteChatflow") {
      handleDeleteFlow();
    } else if (setting === "viewMessages") {
      setViewMessagesDialogProps({
        title: "View Messages",
        chatflow: chatflow,
      });
      setViewMessagesDialogOpen(true);
    } else if (setting === "viewLeads") {
      setViewLeadsDialogProps({
        title: "View Leads",
        chatflow: chatflow,
      });
      setViewLeadsDialogOpen(true);
    } else if (setting === "saveAsTemplate") {
      if (canvas.isDirty) {
        enqueueSnackbar({
          message: "Please save the flow before exporting as template",
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            persist: true,
            action: (key) => (
              <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
                <IconX />
              </Button>
            ),
          },
        });
        return;
      }
      setExportAsTemplateDialogProps({
        title: "Export As Template",
        chatflow: chatflow,
      });
      setExportAsTemplateDialogOpen(true);
    } else if (setting === "viewUpsertHistory") {
      setUpsertHistoryDialogProps({
        title: "View Upsert History",
        chatflow: chatflow,
      });
      setUpsertHistoryDialogOpen(true);
    } else if (setting === "chatflowConfiguration") {
      setChatflowConfigurationDialogProps({
        title: `${title} Configuration`,
        chatflow: chatflow,
      });
      setChatflowConfigurationDialogOpen(true);
    } else if (setting === "duplicateChatflow") {
      try {
        let flowData = chatflow.flowData;
        const parsedFlowData = JSON.parse(flowData);
        flowData = JSON.stringify(parsedFlowData);
        localStorage.setItem("duplicatedFlowData", flowData);
        window.open(`${uiBaseURL}/${isAgentCanvas ? "agentcanvas" : "canvas"}`, "_blank");
      } catch (e) {
        console.error(e);
      }
    } else if (setting === "exportChatflow") {
      try {
        const flowData = JSON.parse(chatflow.flowData);
        let dataStr = JSON.stringify(generateExportFlowData(flowData), null, 2);
        let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

        let exportFileDefaultName = `${chatflow.name} ${title}.json`;

        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onUploadFile = (file) => {
    setSettingsOpen(false);
    handleLoadFlow(file);
  };

  const submitFlowName = () => {
    if (chatflow.id) {
      const updateBody = {
        name: flowNameRef.current.value,
      };
      updateChatflowApi.request(chatflow.id, updateBody);
    }
  };

  const onAPIDialogClick = () => {
    // If file type is file, isFormDataRequired = true
    let isFormDataRequired = false;
    try {
      const flowData = JSON.parse(chatflow.flowData);
      const nodes = flowData.nodes;
      for (const node of nodes) {
        if (node.data.inputParams.find((param) => param.type === "file")) {
          isFormDataRequired = true;
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // If sessionId memory, isSessionMemory = true
    let isSessionMemory = false;
    try {
      const flowData = JSON.parse(chatflow.flowData);
      const nodes = flowData.nodes;
      for (const node of nodes) {
        if (node.data.inputParams.find((param) => param.name === "sessionId")) {
          isSessionMemory = true;
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setAPIDialogProps({
      title: "Embed in website or use as API",
      chatflowid: chatflow.id,
      chatflowApiKeyId: chatflow.apikeyid,
      isFormDataRequired,
      isSessionMemory,
      isAgentCanvas,
    });
    setAPIDialogOpen(true);
  };

  const onSaveChatflowClick = () => {
    if (chatflow.id) handleSaveFlow(flowName);
    else setFlowDialogOpen(true);
  };

  const onConfirmSaveName = (flowName) => {
    setFlowDialogOpen(false);
    handleSaveFlow(flowName,isOrgLevel);
  };

  useEffect(() => {
    if (updateChatflowApi.data) {
      setFlowName(updateChatflowApi.data.name);
      dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data });
    }
    setEditingFlowName(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateChatflowApi.data]);

  const handleConfirm =()=>{
    setIsOrgLevel(true)
    setOrgLevelModal(false)
  }
  useEffect(() => {
    if (chatflow) {
      setFlowName(chatflow.name);
      // if configuration dialog is open, update its data
      if (chatflowConfigurationDialogOpen) {
        setChatflowConfigurationDialogProps({
          title: `${title} Configuration`,
          chatflow,
        });
      }
    }
  }, [chatflow, title, chatflowConfigurationDialogOpen]);

  return (
    <>
      <Stack flexDirection="row" justifyContent="space-between" sx={{ width: "100%" }}>
        <Stack flexDirection="row" sx={{ width: "100%", maxWidth: "50%" }}>
          <Box>
            <ButtonBase title="Back" sx={{ borderRadius: "50%" }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  transition: "all .2s ease-in-out",
                  height: 40,
                  background: "#333b63",
                  color: "#ffffff",
                  "&:hover": {
                    opacity: 0.6,
                  },
                }}
                color="inherit"
                onClick={() =>{
                    if(canvasDataStore?.isDirty){
                      if(window.confirm('You have unsaved changes! Do you want to navigate away?')){
                        window.history.state && window.history.state.idx > 0
                        ? navigate(-1)
                        : navigate("/", { replace: true })
                      }
                    }else{
                       navigate(-1)
                    }

                }  
                }
              >
                <IconChevronLeft stroke={1.5} size="1rem" />
              </Avatar>
            </ButtonBase>
          </Box>
          <Box sx={{ width: "100%" }}>
            {!isEditingFlowName ? (
              <Stack flexDirection="row">
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    mt: 1,
                    ml: 2,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {canvas.isDirty && <strong style={{ color: "#000000" }}>*</strong>} {flowName}
                </Typography>
                {chatflow?.id && (
                  <ButtonBase title="Edit Name" sx={{ borderRadius: "50%" }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: "all .2s ease-in-out",
                        ml: 1,
                        background: "#333b63",
                        color: "#ffffff",
                        "&:hover": {
                          opacity: 0.6,
                        },
                      }}
                      color="inherit"
                      onClick={() => setEditingFlowName(true)}
                    >
                      <IconPencil stroke={1.5} size="1.3rem" />
                    </Avatar>
                  </ButtonBase>
                )}
              </Stack>
            ) : (
              <Stack flexDirection="row" sx={{ width: "100%" }}>
                <TextField
                  autoFocus
                  size="small"
                  inputRef={flowNameRef}
                  sx={{
                    width: "100%",
                    ml: 2,
                  }}
                  defaultValue={flowName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitFlowName();
                    } else if (e.key === "Escape") {
                      setEditingFlowName(false);
                    }
                  }}
                />
                <ButtonBase title="Save Name" sx={{ borderRadius: "50%" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.mediumAvatar,
                      transition: "all .2s ease-in-out",
                      background: "#333b63",
                      color: "#ffffff",
                      ml: 1,
                      "&:hover": {
                        opacity: 0.6,
                      },
                    }}
                    color="inherit"
                    onClick={submitFlowName}
                  >
                    <IconCheck stroke={1.5} size="1.3rem" />
                  </Avatar>
                </ButtonBase>
                <ButtonBase title="Cancel" sx={{ borderRadius: "50%" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.mediumAvatar,
                      transition: "all .2s ease-in-out",
                      background: "#333b63",
                      color: "#ffffff",
                      ml: 1,
                      "&:hover": {
                        opacity: 0.6,
                      },
                    }}
                    color="inherit"
                    onClick={() => setEditingFlowName(false)}
                  >
                    <IconX stroke={1.5} size="1.3rem" />
                  </Avatar>
                </ButtonBase>
              </Stack>
            )}
          </Box>
        </Stack>
        <Box>
          {chatflow?.id && (
            <ButtonBase title="API Endpoint" sx={{ borderRadius: "50%", mx: 2 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar, 
                  transition: "all .2s ease-in-out",
                  background: "#fff",
                  color: "#000000",
                  "&:hover": {
                    opacity: 0.6,
                  },
                }}
                color="inherit"
                onClick={onAPIDialogClick}
              >
                <IconCode stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          )}
          {chatflow?.id && <StyledButton variant='contained' startIcon={<IconPlus />} sx={{ borderRadius: 2, height: 40,mr:2}} onClick={()=>navigate({
                pathname: "/widget/settings",
                search: createSearchParams({
                    chatflowid: chatid
                }).toString()
            })}>
            CREATE WIDGET
          </StyledButton>}
          <ButtonBase title={`Save ${title}`} sx={{ borderRadius: "50%", mr: 2 }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
                background: "#333b63",
                color: theme.dark,
                "&:hover": {
                    opacity: 0.6,
                },
              }}
              color="inherit"
              onClick={onSaveChatflowClick}
            >
              <IconDeviceFloppy stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
          <ButtonBase ref={settingsRef} title="Settings" sx={{ borderRadius: "50%" }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
                background: "#333b63",
                color: "#ffffff",
                "&:hover": {
                  opacity: 0.6,
                },
               
              }}
              onClick={() => setSettingsOpen(!isSettingsOpen)}
            >
              <IconSettings stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Box>
      </Stack>
      <Settings
        chatflow={chatflow}
        isSettingsOpen={isSettingsOpen}
        anchorEl={settingsRef.current}
        onClose={() => setSettingsOpen(false)}
        onSettingsItemClick={onSettingsItemClick}
        onUploadFile={onUploadFile}
        isAgentCanvas={isAgentCanvas}
        setIsOrgLevel={setIsOrgLevel}
        setOrgLevelModal={setOrgLevelModal}
      />
      <SaveChatflowDialog
        show={flowDialogOpen}
        dialogProps={{
          title: `Save New ${title}`,
          confirmButtonName: "Save",
          cancelButtonName: "Cancel",
        }}
        onCancel={() => setFlowDialogOpen(false)}
        onConfirm={onConfirmSaveName}
      />
      <OrganizationLevel open={orgLevelModal} onCancel={setOrgLevelModal} 
      Title="Set Organization Level"
      Description="Do you want to set this orchestrate flow at the Organization level?" 
      Cancel="No"
      Confirm="Yes"
      handleConfirm={handleConfirm}
      />
      <APICodeDialog
        show={apiDialogOpen}
        dialogProps={apiDialogProps}
        onCancel={() => setAPIDialogOpen(false)}
      />
      <ViewMessagesDialog
        show={viewMessagesDialogOpen}
        dialogProps={viewMessagesDialogProps}
        onCancel={() => setViewMessagesDialogOpen(false)}
      />
      <ViewLeadsDialog
        show={viewLeadsDialogOpen}
        dialogProps={viewLeadsDialogProps}
        onCancel={() => setViewLeadsDialogOpen(false)}
      />
      {exportAsTemplateDialogOpen && (
        <ExportAsTemplateDialog
          show={exportAsTemplateDialogOpen}
          dialogProps={exportAsTemplateDialogProps}
          onCancel={() => setExportAsTemplateDialogOpen(false)}
        />
      )}
      <UpsertHistoryDialog
        show={upsertHistoryDialogOpen}
        dialogProps={upsertHistoryDialogProps}
        onCancel={() => setUpsertHistoryDialogOpen(false)}
      />
      <ChatflowConfigurationDialog
        key="chatflowConfiguration"
        show={chatflowConfigurationDialogOpen}
        dialogProps={chatflowConfigurationDialogProps}
        onCancel={() => setChatflowConfigurationDialogOpen(false)}
      />
    </>
  );
};

CanvasHeader.propTypes = {
  chatflow: PropTypes.object,
  handleSaveFlow: PropTypes.func,
  handleDeleteFlow: PropTypes.func,
  handleLoadFlow: PropTypes.func,
  isAgentCanvas: PropTypes.bool,
};

export default CanvasHeader;
