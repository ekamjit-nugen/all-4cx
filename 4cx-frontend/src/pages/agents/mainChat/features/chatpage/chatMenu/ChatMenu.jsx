// import { sortByTimestamp } from "utils/utils";
// import { ChatGroup } from "./ChatGroup";
// import { ChatMenuItem } from "./ChatMenuItem";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useCallback, useEffect, useState } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import { useDispatch } from "react-redux";
// import { addChat } from "store/features/azureChatSidebar";
// import { setRoute } from "store/features/azureChatRoutesSlice";
// import { setActiveChatThread } from "store/features/activeAzureChatThreadSlice";
// import { Button } from "ui/button";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   styled,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { DialogDescription } from "@radix-ui/react-dialog";
// import { updateAzurePersona } from "store/features/azurePersonaSlice";

// const CustomTextField = styled(TextField)(({ theme }) => ({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px", // Rounded corners
//     "& fieldset": {
//       borderColor: theme.palette.primary.main, // Custom border color
//     },
//     "&:hover fieldset": {
//       borderColor: theme.palette.primary.dark, // Darker border on hover
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: theme.palette.primary.dark, // Darker border when focused
//     },
//   },
//   marginTop: theme.spacing(1),
//   padding: theme.spacing(0.5),
// }));

// export const ChatMenu = () => {
//   const [newName, setNewName] = useState("");
//   const [showChatModifyModal, setShowChatModifyModal] = useState(false);
//   const [chatThreadToBeModified, setChatThreadToBeModified] = useState("");
//   // Access the chats array from the Redux store
//   const { userId, orgId } = useAuth();
//   const dispatch = useDispatch();
//   const chats = useSelector((state) => state.chatSidebarInstance.chats);
//   const selectedProjectId = useSelector((state) => state.projectIdList.projectId);
//   const activeChatThread = useSelector((state) => state.activeChatThread.activeChatThread);

//   // Group the chats by type
//   const menuItemsGrouped = chats.length > 0 && GroupChatThreadByType(chats);

//   const fetchChatThreads = async ({ organizationId, projectId, userId }) => {
//     if (!organizationId || !projectId || !userId) {
//       throw new Error("organizationId, projectId, and userId are required");
//     }

//     const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${organizationId}/projects/${projectId}/users/${userId}/ai_chat`;

//     try {
//       // Fetch the chat threads using GET request
//       const response = await axios.get(URL);
//       dispatch(updateAzurePersona(response));

//       return response.data; // Return only the data from the response
//     } catch (error) {
//       console.error("Error fetching chat threads:", error.response?.data || error.message);
//       throw error;
//     }
//   };

//   const handleFetchChatThreads = useCallback(async () => {
//     try {
//       // Prepare the payload for fetching chats
//       const payload = {
//         organizationId: orgId,
//         projectId: selectedProjectId,
//         userId,
//       };

//       // Fetch initial chat instances
//       const { data } = await fetchChatThreads(payload);

//       // Check if the response is an array
//       if (!Array.isArray(data)) {
//         throw new Error("Expected an array of chat threads");
//       }

//       // Dispatch each chat thread to Redux store
//       data.forEach(({ _id, project_id, name, createdAt }) => {
//         // Ensure no duplicates by checking for chat existence in the Redux store
//         const chatExists = chats.some((chat) => chat._id === _id);
//         if (!chatExists) {
//           dispatch(
//             addChat({
//               _id,
//               title: name,
//               projectId: project_id,
//               timeStamp: createdAt,
//             })
//           );
//         }
//       });
//     } catch (error) {
//       alert(`Error: ${error.message}`);
//     }
//   }, [dispatch, orgId, selectedProjectId, userId]);

//   const handleDeleteChatThreads = async (_threadId) => {
//     // Validate the required parameters
//     if (!orgId || !selectedProjectId || !userId || !_threadId) {
//       alert("Missing required parameters");
//       return;
//     }

//     // Build the API endpoint URL

//     const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${_threadId}`;

//     try {
//       // Make the DELETE request
//       const response = await axios.delete(URL);

//       // Check if the deletion was successful
//       if (response.status === 200) {
//         window.location.reload();
//       } else {
//         console.error("Failed to delete the chat thread. Status code:", response.status);
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Thread not found (404)";
//       console.error("Error deleting chat thread:", errorMsg);

//       // Handle 404 error specifically
//       if (error.response?.status === 404) {
//         alert("Chat thread not found. It might have been already deleted.");
//       } else {
//         alert(`Error: ${error.message}`);
//       }
//     }
//   };

//   const handleFetchCurrentChatThread = async (_threadId) => {
//     // Validate the required parameters
//     if (!orgId || !selectedProjectId || !userId || !_threadId) {
//       alert("Missing required parameters");
//       return;
//     }

//     // Build the API endpoint URL
//     const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${_threadId}`;

//     try {
//       // Make the GET request to fetch the current chat thread
//       const response = await axios.get(URL);

//       // Destructure the necessary data from the response
//       const { data, status } = response;

//       // Handle successful response
//       if (status === 200) {
//         return data; // Return the fetched chat thread data
//       } else {
//         console.error(`Unexpected response status: ${status}`);
//         alert(`Failed to fetch the chat thread. Status code: ${status}`);
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Thread not found (404)";
//       console.error("Error fetching chat thread:", errorMsg);

//       // Handle specific 404 error case
//       if (error.response?.status === 404) {
//         alert("Chat thread not found. It might have been already deleted.");
//       } else {
//         // General error alert for other cases
//         alert(`Error: ${error.message}`);
//       }
//     }
//   };

//   const handleRedirectChatThread = async (event, chatInstance) => {
//     // setting current chatInstance for chatArea
//     const activeChatThreadInstance = await handleFetchCurrentChatThread(chatInstance._id);
//     const { chat_history, ...otherValues } = activeChatThreadInstance.data;

//     const chatInstancePayload = otherValues;

//     // setting the active-chat instance
//     dispatch(setActiveChatThread(chatInstancePayload));

//     // redirecting to chatpage
//     dispatch(setRoute(11));
//   };

//   // RENAME MODAL FUNCTIONALITIES
//   const handleModifyChatThreadModal = (_chatInstance) => {
//     setShowChatModifyModal((prevState) => !prevState);
//     const { _id, title } = _chatInstance;
//     setNewName(title);
//     setChatThreadToBeModified(_chatInstance._id);
//   };

//   const handleChatThreadModifySubmitClick = async () => {
//     // Validate the required parameters
//     if (!orgId || !selectedProjectId || !userId || !chatThreadToBeModified) {
//       alert("Missing required parameters");
//       return;
//     }

//     // Build the API endpoint URL

//     const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${chatThreadToBeModified}`;

//     try {
//       // Make the DELETE request
//       const response = await axios.patch(URL, {
//         title: newName,
//       });

//       // Check if the deletion was successful
//       if (response.status === 200) {
//         // window.location.reload();
//       } else {
//         console.error("Failed to rename the chat thread. Status code:", response.status);
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Thread not found (404)";
//       console.error("Error Renaming chat thread:", errorMsg);
//     } finally {
//       handleOpenCloseDialogClick(false);
//     }
//   };

//   const handleOpenCloseDialogClick = (op) =>
//     op === true
//       ? setShowChatModifyModal(true)
//       : op === false
//       ? setShowChatModifyModal(false)
//       : null;

//   useEffect(() => {
//     if (userId && orgId && selectedProjectId) {
//       handleFetchChatThreads();
//     }
//   }, [userId, orgId, selectedProjectId, handleFetchChatThreads]);

//   return (
//     <>
//       <Dialog
//         open={showChatModifyModal}
//         onClose={() => handleOpenCloseDialogClick(false)}
//         PaperProps={{
//           style: {
//             width: "500px", // Adjust width as needed
//             maxWidth: "80vw", // Ensure it's responsive
//           },
//         }}
//       >
//         <DialogTitle>Rename Chat Thread</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="textSecondary" paragraph>
//             Write the relevant chat name to rename the chat thread.
//           </Typography>
//           <CustomTextField
//             autoFocus
//             label="Name"
//             type="text"
//             fullWidth
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button
//             className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded transition-colors duration-300"
//             onClick={() => handleOpenCloseDialogClick(false)}
//             color="primary"
//           >
//             Cancel
//           </Button>
//           <Button
//             className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300"
//             onClick={handleChatThreadModifySubmitClick}
//           >
//             Rename
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <div className="px-3 flex flex-col gap-8 overflow-hidden text-base">
//         {Object.entries(menuItemsGrouped).map(([groupName, groupItems], index) => {
//           if (Array.isArray(groupItems) && groupItems.length > 0) {
//             return (
//               <ChatGroup key={index} title={groupName}>
//                 {groupItems.map((item, idx) => (
//                   <ChatMenuItem
//                     key={idx}
//                     chatThread={item}
//                     handleDeleteChatThreads={handleDeleteChatThreads}
//                     onClick={(event) => handleRedirectChatThread(event, item)}
//                     handleModifyChatThreads={handleModifyChatThreadModal} // Ensure prop name matches
//                   >
//                     {item.title}
//                   </ChatMenuItem>
//                 ))}
//               </ChatGroup>
//             );
//           } else {
//             return null; // Return nothing if groupItems is undefined or empty
//           }
//         })}
//       </div>
//     </>
//   );
// };

// export const GroupChatThreadByType = (menuItems) => {
//   // Create a shallow copy of the array to avoid mutating the original one
//   const sortedMenuItems = [...menuItems].sort(sortByTimestamp);

//   const groupedMenuItems = [];

//   const today = new Date();
//   const sevenDaysAgo = new Date(today);
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   sortedMenuItems.forEach((el) => {
//     if (el.bookmarked) {
//       groupedMenuItems.push({
//         ...el,
//         groupName: "Bookmarked",
//       });
//     } else if (new Date(el.timeStamp) > sevenDaysAgo) {
//       groupedMenuItems.push({
//         ...el,
//         groupName: "Past 7 days",
//       });
//     } else {
//       groupedMenuItems.push({
//         ...el,
//         groupName: "Previous",
//       });
//     }
//   });

//   // Group items by groupName
//   const menuItemsGrouped = groupedMenuItems.reduce((acc, el) => {
//     const key = el.groupName;
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(el);
//     return acc;
//   }, {});

//   // Return sorted records by group
//   return {
//     Bookmarked: menuItemsGrouped["Bookmarked"]?.sort(sortByTimestamp) || [],
//     "Past 7 days": menuItemsGrouped["Past 7 days"]?.sort(sortByTimestamp) || [],
//     Previous: menuItemsGrouped["Previous"]?.sort(sortByTimestamp) || [],
//   };
// };



import { sortByTimestamp } from "utils/utils"; // Ensure this utility uses updatedAt for sorting
import { ChatGroup } from "./ChatGroup";
import { ChatMenuItem } from "./ChatMenuItem";
import { useSelector } from "react-redux";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { addChat } from "store/features/azureChatSidebar";
import { setRoute } from "store/features/azureChatRoutesSlice";
import { setActiveChatThread } from "store/features/activeAzureChatThreadSlice";
import { Button } from "ui/button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { updateAzurePersona } from "store/features/azurePersonaSlice";
import { setChats } from "store/features/azureChatSidebar";
import { setFlowiseId } from "store/features/azureChatRoutesSlice";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.dark,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.dark,
    },
  },
  marginTop: theme.spacing(1),
  padding: theme.spacing(0.5),
}));

export const ChatMenu = () => {
  const [newName, setNewName] = useState("");
  const [showChatModifyModal, setShowChatModifyModal] = useState(false);
  const [chatThreadToBeModified, setChatThreadToBeModified] = useState("");
  const { userId, orgId } = useAuth();
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chatSidebarInstance.chats);
  const selectedProjectId = useSelector((state) => state.projectIdList.projectId);

  // Group the chats by type
  const menuItemsGrouped = chats.length > 0 && GroupChatThreadByType(chats);

  const fetchChatThreads = async ({ organizationId, projectId, userId }) => {
    if (!organizationId || !projectId || !userId) {
      throw new Error("organizationId, projectId, and userId are required");
    }

    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${organizationId}/projects/${projectId}/users/${userId}/ai_chat`;

    try {
      const response = await axios.get(URL);
      dispatch(updateAzurePersona(response));

      return response.data;
    } catch (error) {
      console.error("Error fetching chat threads:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleFetchChatThreads = useCallback(async () => {
    try {
      const payload = {
        organizationId: orgId,
        projectId: selectedProjectId,
        userId,
      };

      const { data } = await fetchChatThreads(payload);

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of chat threads");
      }

      data.forEach(({ _id, project_id, name, updatedAt }) => {
        const chatExists = chats.some((chat) => chat._id === _id);
        if (!chatExists) {
          dispatch(
            addChat({
              _id,
              title: name,
              projectId: project_id,
              timeStamp: updatedAt, // Use updatedAt for timestamp
            })
          );
        }
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }, [dispatch, orgId, selectedProjectId, userId]);

  const handleDeleteChatThreads = async (_threadId) => {
    if (!orgId || !selectedProjectId || !userId || !_threadId) {
      alert("Missing required parameters");
      return;
    }

    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${_threadId}`;

    try {
      const response = await axios.delete(URL);

      if (response.status === 200) {
        const updatedChatLists = chats.filter((chat, index) => _threadId !== chat._id);

        await Promise.all([dispatch(setRoute(1)), dispatch(setChats(updatedChatLists))]);
      } else {
        console.error("Failed to delete the chat thread. Status code:", response.status);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Thread not found (404)";
      console.error("Error deleting chat thread:", errorMsg);

      if (error.response?.status === 404) {
        alert("Chat thread not found. It might have been already deleted.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleFetchCurrentChatThread = async (_threadId) => {
    if (!orgId || !selectedProjectId || !userId || !_threadId) {
      alert("Missing required parameters");
      return;
    }

    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${_threadId}`;

    try {
      const response = await axios.get(URL);
      const { data, status } = response;
      if(data?.data?.flowise_id !== null){
        dispatch(setFlowiseId(data?.data?.flowise_id))
      }

      if (status === 200) {
        return data;
      } else {
        console.error(`Unexpected response status: ${status}`);
        alert(`Failed to fetch the chat thread. Status code: ${status}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Thread not found (404)";
      console.error("Error fetching chat thread:", errorMsg);

      if (error.response?.status === 404) {
        alert("Chat thread not found. It might have been already deleted.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleRedirectChatThread = async (event, chatInstance) => {
    const activeChatThreadInstance = await handleFetchCurrentChatThread(chatInstance._id);
    const { chat_history, ...otherValues } = activeChatThreadInstance.data;

    const chatInstancePayload = otherValues;

    dispatch(setActiveChatThread(chatInstancePayload));
    dispatch(setRoute(11));
  };

  const handleModifyChatThreadModal = (_chatInstance) => {
    setShowChatModifyModal((prevState) => !prevState);
    const { _id, title } = _chatInstance;
    setNewName(title);
    setChatThreadToBeModified(_chatInstance._id);
  };

  const handleChatThreadModifySubmitClick = async () => {
    if (!orgId || !selectedProjectId || !userId || !chatThreadToBeModified) {
      alert("Missing required parameters");
      return;
    }

    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${chatThreadToBeModified}`;

    try {
      const response = await axios.patch(URL, {
        title: newName,
      });

      if (response.status === 200) {
        // window.location.reload();
        const updatedChatList = chats.map((chat) => {
          if (chat._id === chatThreadToBeModified) {
            return { ...chat, title: newName }; // Update title for matching chat
          }
          return chat; // Keep other chats unchanged
        });
        const { name, ...otherField } = activeChatThread;

        const updatedActiveChatThread = {
          ...otherField,
          name: newName,
        };

        dispatch(setChats(updatedChatList));
        dispatch(setActiveChatThread(updatedActiveChatThread));
      } else {
        console.error("Failed to rename the chat thread. Status code:", response.status);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Thread not found (404)";
      console.error("Error Renaming chat thread:", errorMsg);
    } finally {
      handleOpenCloseDialogClick(false);
    }
  };

  const handleOpenCloseDialogClick = (op) =>
    op === true
      ? setShowChatModifyModal(true)
      : op === false
      ? setShowChatModifyModal(false)
      : null;

  useEffect(() => {
    if (userId && orgId && selectedProjectId) {
      handleFetchChatThreads();
    }
  }, [userId, orgId, selectedProjectId, handleFetchChatThreads]);

  return (
    <>
      <Dialog
        open={showChatModifyModal}
        onClose={() => handleOpenCloseDialogClick(false)}
        PaperProps={{
          style: {
            width: "500px",
            maxWidth: "80vw",
          },
        }}
      >
        <DialogTitle>Rename Chat Thread</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Write the relevant chat name to rename the chat thread.
          </Typography>
          <CustomTextField
            autoFocus
            label="Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded transition-colors duration-300"
            onClick={() => handleOpenCloseDialogClick(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded transition-colors duration-300"
            onClick={handleChatThreadModifySubmitClick}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      <div className="px-3 flex flex-col gap-8 overflow-hidden text-base">
        {Object.entries(menuItemsGrouped).map(([groupName, groupItems], index) => {
          if (Array.isArray(groupItems) && groupItems.length > 0) {
            return (
              <ChatGroup key={index} title={groupName}>
                {groupItems.map((item) => (
                  <ChatMenuItem
                    key={item._id} // Change to unique identifier
                    chatThread={item}
                    handleDeleteChatThreads={handleDeleteChatThreads}
                    onClick={(event) => handleRedirectChatThread(event, item)}
                    handleModifyChatThreads={handleModifyChatThreadModal}
                  >
                    {item.title}
                  </ChatMenuItem>
                ))}
              </ChatGroup>
            );
          } else {
            return null;
          }
        })}
      </div>
    </>
  );
};

const GroupChatThreadByType = (menuItems) => {
  const sortedMenuItems = [...menuItems].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt

  const groupedMenuItems = [];

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  sortedMenuItems.forEach((el) => {
    if (el.bookmarked) {
      groupedMenuItems.push({
        ...el,
        groupName: "Bookmarked",
      });
    } else if (new Date(el.updatedAt) > sevenDaysAgo) {
      groupedMenuItems.push({
        ...el,
        groupName: "Past 7 days",
      });
    } else {
      groupedMenuItems.push({
        ...el,
        groupName: "Previous",
      });
    }
  });

  const menuItemsGrouped = groupedMenuItems.reduce((acc, el) => {
    const key = el.groupName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(el);
    return acc;
  }, {});

  return {
    Bookmarked: menuItemsGrouped["Bookmarked"]?.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) || [],
    "Past 7 days": menuItemsGrouped["Past 7 days"]?.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) || [],
    Previous: menuItemsGrouped["Previous"]?.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) || [],
  };
};


// const GroupChatThreadByType = (menuItems) => {
//   const sortedMenuItems = [...menuItems].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updatedAt

//   const groupedMenuItems = sortedMenuItems.reduce((acc, el) => {
//     let groupName;

//     if (el.bookmarked) {
//       groupName = "Bookmarked";
//     } else if (new Date(el.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) { // Check if updated in the last 7 days
//       groupName = "Past 7 days";
//     } else {
//       groupName = "Previous";
//     }

//     if (!acc[groupName]) {
//       acc[groupName] = [];
//     }
//     acc[groupName].push(el);
//     return acc;
//   }, {});

//   return {
//     Bookmarked: groupedMenuItems["Bookmarked"] || [],
//     "Past 7 days": groupedMenuItems["Past 7 days"] || [],
//     Previous: groupedMenuItems["Previous"] || [],
//   };
// };
