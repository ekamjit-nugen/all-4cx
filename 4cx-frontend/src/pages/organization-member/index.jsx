import PropTypes from "prop-types";
import List from "@mui/material/List";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import fetchData from "../../services/api";
import { useAuth } from "@clerk/clerk-react";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import SoftButton from "components/soft-button";
import { Box, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";

function OrganizationMembers({ projectId, collaboratorId }) {
  const { orgId, userId } = useAuth();
  const [checked, setChecked] = React.useState([]);
  const [userList, setUserList] = React.useState([]);

  useEffect(() => {
    if (Array.isArray(collaboratorId)) {
      setChecked(collaboratorId);
    }
  }, [collaboratorId]);

  useEffect(() => {
    const fetchProjectList = async () => {
      try {
        const url = `tenant/${orgId}`;
        const data = await fetchData(url, "GET");
        setUserList(data);
      } catch (error) {
        console.error("Error fetching project list:", error);
      }
    };

    if (orgId) {
      fetchProjectList();
    }
  }, [orgId]);

  const handleToggle = (userId) => () => {
    const currentIndex = checked.indexOf(userId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(userId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAddCollaborator = async () => {
    const collaboratorData = { projectId: projectId, collaborators: checked };
    try {
      const url = `project/`;
      const data = await fetchData(url, "PUT", collaboratorData);
      toast.success(data?.message);
    } catch (error) {
      toast.error("Failed to add collaborator. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "40px 0px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <List
        dense
        sx={{
          width: "340px",
          maxWidth: 360,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderRadius: "10px",
          background: "white",
          bgcolor: "background.paper",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography sx={{ textAlign: "left", fontSize: "16px", fontWeight: "bold" }}>
          Organisation Members
        </Typography>

        {userList?.data?.map(({ public_user_data: user }, index) => {
          const isCollaborator =
            Array.isArray(collaboratorId) && collaboratorId.includes(user.user_id);
          const isChecked = user.user_id === userId;

          return (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <ListItemButton
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: "10px",
                  opacity: isChecked || isCollaborator ? 0.6 : 1,
                  pointerEvents: isCollaborator ? "none" : "auto",
                }}
                key={index}
              >
                <ListItemAvatar sx={{ width: "10px", minWidth: "unset" }}>
                  <Checkbox
                    edge="start"
                    onChange={handleToggle(user.user_id)}
                    checked={isChecked || checked.includes(user.user_id)}
                    disabled={isCollaborator && !isChecked}
                  />
                </ListItemAvatar>
                <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    alt={`Avatar ${user?.first_name}`}
                    src={user?.profile_image_url}
                  />
                  <ListItemText
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: "bold !important",
                        fontSize: "13px",
                      },
                    }}
                    primary={user?.identifier}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          textAlign: "center",
          gap: "15px",
          width: "100%",
        }}
      >
        <SoftButton
          onClick={handleAddCollaborator}
          variant="contained"
          color="success"
          sx={{ width: "20%" }}
        >
          Add
        </SoftButton>
      </Box>
    </Box>
  );
}

OrganizationMembers.propTypes = {
  projectId: PropTypes.string.isRequired,
  collaboratorId: PropTypes.array.isRequired,
};

export default OrganizationMembers;
