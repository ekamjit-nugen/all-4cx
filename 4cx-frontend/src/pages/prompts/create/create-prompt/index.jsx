import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import SoftButton from "components/soft-button";
import fetchData from "../../../../services/api";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageLoader from "../../../../components/page-loader";
import TextEditor from "../../prompt-flow/modules/textEdition";
import { initialPromptOrganisationData, initialPromptProjectData } from "../../prompt-flow/const";
import { Avatar, Box, Input, Switch, Typography, useMediaQuery } from "@mui/material";
import { updateEditPromptStatus, updateEditPromptData } from "store/features/promptSlice";

export default function CreateNewPrompt() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgId, userId } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = useSelector((state) => state.prompt.isEdit);
  const promptEditData = useSelector((state) => state.prompt.data);
  const [promptData, setPromptData] = useState(promptEditData);
  const reduxVersion = useSelector((state) => state.prompt.version);
  const reduxPromptId = useSelector((state) => state.prompt.promptId);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isStateEmpty = Object.values(promptData).every((value) => value === "");
  const handleEdit = (value) => setPromptData((promptData) => ({ ...promptData, text: value }));
  const handleDescription = (value) => setPromptData((promptData) => ({...promptData, description: value}));
  // const handleSystemMessage = (value) => setPromptData((promptData) => ({...promptData, systemMessage: value}));
  const handleReadme = (value) => setPromptData((promptData) => ({...promptData, readme: value}));
  const {state} = useLocation()

  const handleOnChange = (name, value) => {
    setPromptData({
      ...promptData,
      userId,
      projectId,
      organizationId: orgId,
      [name]: value,
    });
  };

  const handleCreatePrompt = () => {
    if (!isStateEmpty) {
      setIsLoading(true);
      fetchData("/prompt", "POST", promptData, userId)
        .then((response) => {
          if (response) {
            setPromptData(initialPromptProjectData);
            toast.success("New prompt version is created");
            setTimeout(() => {
              navigate("/prompt/project");
            }, 1000);
          }
        })
        .catch((error) => toast.error(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleUpdatePrompt = () => {
    setIsLoading(true);
    fetchData(`/prompt/${reduxPromptId}/version/${reduxVersion}`, "PUT", promptData)
      .then((response) => {
        if (response && response.message) {
          dispatch(updateEditPromptStatus(false));
          toast.success("New prompt version is created");
          setTimeout(() => {
            navigate("/prompt/project");
          }, 1000);
        } else {
          toast.error("Update failed");
        }
      })
      .catch((error) => {
        console.log(error, "error");
        toast.error("Unauthorized access can't perform this action");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const handleAuthorName = async () => {
      try {
        const response = await fetchData("tenant/", "POST", { userId });
        setEmail(response?.tenantInfo?.email);
      } catch (error) {
        console.error("Error extracting data:", error);
      }
    };
    if (userId) {
      handleAuthorName();
    }
  }, [userId]);
  useEffect(()=>{
    if(state?.name === undefined || null){
     dispatch(updateEditPromptData(initialPromptProjectData));
     dispatch(updateEditPromptStatus(false));
     setPromptData(initialPromptProjectData);
    }else if(state?.name === 'org'){
      dispatch(updateEditPromptData(initialPromptOrganisationData));
      dispatch(updateEditPromptStatus(false));
      setPromptData(initialPromptOrganisationData);
     }
  },[state])

  const handleCancel = () => {
    dispatch(updateEditPromptData(initialPromptProjectData));
    dispatch(updateEditPromptStatus(false));
    setPromptData(initialPromptProjectData);
    navigate("/prompt/project");
  };

  useEffect(() => {
    if (isEdit) {
      setPromptData({
        userId: userId,
        projectId: projectId,
        organizationId: orgId,
        promptId: promptEditData?.prompt_id,
        title: promptEditData?.prompt_title,
        category: promptEditData?.category,
        isOrganization: promptEditData?.prompt_type === "PROJECT" ? false : true,
        text: promptEditData?.prompt_text,
        description:promptEditData?.description,
        readme:promptEditData?.readme,
        systemMessage:promptEditData?.systemMessage
      });
    } else {
      // setPromptData(promptEditData);
    }
  }, [isEdit, promptEditData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingX: isSmallScreen ? 2 : 4,
        paddingTop: 5,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      {isLoading && <PageLoader />}
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
          {!isEdit ? "New Prompt" : "Edit Prompt"}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {!isEdit ? "Create New Prompt" : ""}
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 5, paddingX: isSmallScreen ? 1 : 2 }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: isSmallScreen ? "100%" : "40%",
            }}
          >
            <Typography sx={{ paddingX: 2, fontSize: 16, fontWeight: 600 }}>Prompt Name</Typography>
            <Input
              sx={{
                width: "100%",
                "&:before, &:after": {
                  display: "none",
                },
              }}
              disabled={isEdit}
              value={promptData.title}
              placeholder="Please enter a name"
              onChange={(e) => handleOnChange("title", e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: isSmallScreen ? "100%" : "40%",
            }}
          >
            <Typography sx={{ paddingX: 2, fontSize: 16, fontWeight: 600 }}>
              Prompt Category
            </Typography>
            <Input
              sx={{
                width: "100%",
                "&:before, &:after": {
                  display: "none",
                },
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              disabled={isEdit}
              value={promptData.category}
              placeholder="Please enter a category"
              onChange={(e) => handleOnChange("category", e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: isSmallScreen ? "100%" : "40%",
              color: "#333a63",
              alignItems: "center",
            }}
          >
            <Avatar />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{email}</Typography>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Organisation Prompt</Typography>
            <Typography sx={{ fontSize: 16 }}>
              Share this prompt with the rest of the organisation
            </Typography>
          </Box>

          <Switch
            checked={promptData.isOrganization}
            onChange={(e) => handleOnChange("isOrganization", e.target.checked)}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>System Message</Typography>
            <Typography sx={{ fontSize: 16 }}>Write your System Message</Typography>
          </Box>

          <TextEditor initialValue={promptData.text} onChange={handleEdit} />
        </Box>
        {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>System Message</Typography>
            <Typography sx={{ fontSize: 16 }}>Write your System Message</Typography>
          </Box>

          <TextEditor initialValue={promptData.systemMessage} onChange={handleSystemMessage}/>
        </Box> */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Description</Typography>
            <Typography sx={{ fontSize: 16 }}>Write your description</Typography>
          </Box>

          <TextEditor initialValue={promptData.description} onChange={handleDescription}/>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Readme</Typography>
            <Typography sx={{ fontSize: 16 }}>Write your readme</Typography>
          </Box>

          <TextEditor initialValue={promptData.readme} onChange={handleReadme}/>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: isSmallScreen ? "center" : "flex-end",
            alignItems: isSmallScreen ? "center" : "flex-end",
            gap: 2,
            flexDirection: isSmallScreen ? "column" : "row",
            paddingTop: isSmallScreen ? "60px" : "0px",
          }}
        >
          {isEdit && (
            <SoftButton
              color="light"
              onClick={handleCancel}
              sx={{
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              CANCEL
            </SoftButton>
          )}

          {!isEdit ? (
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={handleCreatePrompt}
              sx={{
                width: isSmallScreen ? "100%" : "auto",
              }}
              disabled={isLoading}
            >
              CREATE PROMPT
            </SoftButton>
          ) : (
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={handleUpdatePrompt}
              sx={{
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              UPDATE PROMPT
            </SoftButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
