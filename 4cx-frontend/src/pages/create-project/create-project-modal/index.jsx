import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Box, Input } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import fetchData from "../../../services/api";
import SoftButton from "components/soft-button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { setProjectId } from "store/features/projectIdSlice";
import OrganizationMembers from "../../../pages/organization-member";
import { setSelectedProjectName } from "store/features/projectIdSlice";
import { useNavigate } from "react-router-dom";

function CreateProjectBox() {
  const { userId, orgId, orgRole } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [projectListId, setProjectListId] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [fetchColl, setFetchColl] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const saveSelectedProjectToLocalStorage = (projectName) => {
    localStorage.setItem("selectedProject", projectName);
  };

  const loadSelectedProjectFromLocalStorage = () => {
    return localStorage.getItem("selectedProject");
  };

  const showProject = () => {
    fetchData(`project/user/${userId}/organizationId/${orgId}`, "GET")
      .then((response) => {
        let data = response.data;
        let projectTitle = data.map((project) => project.title);
        let projectId = data.map((project) => project._id);

        const storedProject = loadSelectedProjectFromLocalStorage();
        if (storedProject && projectTitle.includes(storedProject)) {
          setSelectedProject(storedProject);
          const selectedProjectId = projectId[projectTitle.indexOf(storedProject)];
          setProjectListId(selectedProjectId);
          dispatch(setProjectId({ projectId: selectedProjectId }));
        } else if (projectTitle.length > 0) {
          const defaultProject = projectTitle[0];
          setSelectedProject(defaultProject);
          dispatch(setSelectedProjectName(defaultProject));
          const defaultProjectId = projectId[0];
          setProjectListId(defaultProjectId);
          dispatch(setProjectId({ projectId: defaultProjectId }));
          saveSelectedProjectToLocalStorage(defaultProject);
        }
      })
      .catch((error) => console.log("error from showProject ", error));
  };

  const getCollaborator = async () => {
    if (projectListId !== "") {
      fetchData(`project/id/${projectListId}`, "GET")
        .then((response) => {
          setFetchColl(response.projectInfo.collaborators);
        })
        .catch((error) => console.log("error", error));
    }
  };

  useEffect(() => {
    if ((userId, orgId)) {
      showProject();
      getCollaborator();
    }
  }, [selectedProject, projectListId, userId, orgId]);

  useEffect(() => {
    if (orgId && userId) {
      setSelectedProject("");
      showProject();
    }
  }, [orgId]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(setSelectedProjectName(selectedProject));
      dispatch(setProjectId({ projectId: projectListId }));
      saveSelectedProjectToLocalStorage(selectedProject);
    }
  }, [selectedProject, projectListId, dispatch]);

  const handleCreate = () => {
    const data = { title: inputValue, userId: userId, collaborators: [], orgId: orgId };
    fetchData("project/", "POST", data)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          setResponse(response.message);
          toast.success(response.message);
          navigate("/")
          setInputValue("");
          setTimeout(() => {
            setResponse("");
          }, 3000);
          showProject();
        }
      })
      .catch((error) => {
        toast.error("Project title already exist");
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography
          sx={{
            borderBottom: "1px solid #dee0e1",
            padding: "15px",
            fontWeight: "600",
            fontSize: "16px",
            width: "auto",
          }}
        >
          Projects
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "2rem",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: "500" }}>
              Create New Projects
            </Typography>
            <Input
              sx={{
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
          </Box>
          <Box sx={{ fontSize: "12px" }}>{response}</Box>
          <SoftButton variant="gradient" color="dark" sx={{ width: "40%" }} onClick={handleCreate} disabled={!inputValue.length}>
            Create
          </SoftButton>
        </Box>

        <Box sx={{ borderBottom: "1px solid #dee0e1", width: "auto" }}></Box>
        {orgRole === "org:admin" && <OrganizationMembers projectId={projectListId} collaboratorId={fetchColl} />}
      </Box>
    </>
  );
}

export default CreateProjectBox;
