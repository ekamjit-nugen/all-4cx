import { NewChatButton } from "./ChatNewButton";
import { ChatContextMenu } from "./ChatContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "store/features/azureChatSidebar";
import { setRoute } from "store/features/azureChatRoutesSlice";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { setActiveChatThread } from "store/features/activeAzureChatThreadSlice";
import { setChatRoute } from "store/features/azureChatRoutesSlice";

export const ChatMenuHeader = () => {
  const selectedProjectId = useSelector((state) => state.projectIdList.projectId);
  const dispatch = useDispatch();
  const { orgId, userId } = useAuth();

  const handleCreateChatThread = async ({ organizationId, projectId, userId, chatData }) => {
    // Validate required parameters
    if (!organizationId || !projectId || !userId) {
      throw new Error("organizationId, projectId, and userId are required");
    }

    // Endpoint URL with parameters
    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${organizationId}/projects/${projectId}/users/${userId}/ai_chat`;

    try {
      // Making the POST request with Axios
      const response = await axios.post(URL, chatData);

      // Return the full response object
      return response;
    } catch (error) {
      // Log and rethrow error
      console.error("Error creating chat thread:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleChatCreationAndNavigation = (thredId) => async (dispatch) => {
    try {
      // Dispatch addChat action
      const chatData = {
        _id: thredId, // Assuming uuidv4 is imported
        title: "New Chat Session",
        timeStamp: new Date().toISOString(),
      };

      await dispatch(addChat(chatData));

      // After chat creation, set the route
      dispatch(setRoute(11));
    } catch (error) {
      console.error("Error adding chat and setting route:", error);
    }
  };

  const handleAddNewChatInstance = async () => {
    dispatch(setChatRoute(2))
    // Validate required parameters
    if (!orgId || !selectedProjectId || !userId) {
      throw new Error("organizationId, projectId, and userId are required");
    }

    const chatThreadCreationPayload = {
      organizationId: orgId,
      projectId: selectedProjectId,
      userId,
      chatData: {
        name: "New Chat Session",
        personaMessage: "Hello!",
        personaMessageTitle: "Introduction",
        type: "CHAT_THREAD",
      },
    };

    try {
      const chatThreadInstanceCreation = await handleCreateChatThread(chatThreadCreationPayload);

      const {
        data: { data },
      } = chatThreadInstanceCreation;

      if (chatThreadInstanceCreation.status === 200) {
        dispatch(setActiveChatThread(data));
        dispatch(handleChatCreationAndNavigation(data._id));
      }
    } catch (error) {
      console.error("Error creating chat instance:", error);
    }
  };

  return (
    <div className="flex p-2 px-3 justify-end">
      {/* <form action={CreateChatAndRedirect} className="flex gap-2 pr-3"></form> */}
      <div className="flex gap-2 pr-3">
        <NewChatButton addChatHandler={handleAddNewChatInstance} />
        {/* <ChatContextMenu /> */}
      </div>
    </div>
  );
};
