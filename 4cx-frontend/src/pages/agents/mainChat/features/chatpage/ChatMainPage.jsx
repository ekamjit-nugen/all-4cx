import { useRef, useState, useEffect } from "react";
import ChatHeader from "./chatHeader/ChatHeader";
import { ChatMessageArea } from "./chatMessageArea/ChatMessageArea";
import ChatMessageContainer from "./chatMessageArea/ChatMessageContainer";
import ChatMessageContentArea from "./chatMessageArea/ChatMessageContentArea";
import MessageContent from "./MessageContent";
import { ChatInput } from "../chatInput/ChatInput";
import { ChatLoading } from "./chatMessageArea/ChatLoading";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { reset } from "store/features/chatImageInputSlide";
import fetchData from "services/api";
import { setChatRoute } from "store/features/azureChatRoutesSlice";
import { baseURL } from "pages/flowies/store/constant";

const initialMessage = {
  _id: 1,
  name: "Chat Assistant",
  role: "assistant",
  content: "Hello, how can I assist you today?",
};

// Mock API functions (replace with real API calls)
const fetchChatMessages = async () => {
  // Mock chat assistant data
  return [
    {
      _id: 1,
      name: "Chat Assistant",
      role: "assistant",
      content: "Hello, how can I assist you today?",
    },
  ];
};

const sendMessageToAPI = async (message) => {
  // Mock response from sending a message
  return {
    _id: Date.now(),
    name: "User",
    role: "user",
    content: message,
  };
};

const generateAIMessageStructure = (_aiMessage) => {
  return {
    _id: Date.now() + Math.random(),
    name: "Chat Assistant",
    role: "assistant",
    content: _aiMessage,
  };
};

const generateUserMessageStructure = (_userMessage) => {
  return {
    _id: Date.now() + Math.random(),
    name: "User",
    role: "user",
    content: _userMessage,
  };
};

export const ChatPage = (props) => {
  const [messages, setMessages] = useState([initialMessage]);
  const [chatThreadDetails, setChatThreadDetails] = useState({});
  const [personaDetails, setPersonaDetails] = useState(null);

  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const selectedProjectId = useSelector((state) => state.projectIdList.projectId);
  const currentActiveThreadId = useSelector((state) => state.activeChatThread.activeChatThread._id);
  const sidebarChatInstance = useSelector((state) => state.chatSidebarInstance);
  const base64Image = useSelector((state) => state.inputImage.base64Image);
  const azurePersona = useSelector((state) => state.azurePersona.data);
  const azureRoute = useSelector((state) => state.azureChatRoutes.currentChatRoute);
  const flowiseId = useSelector((state) => state.azureChatRoutes.flowiseId);

  const { userId, orgId } = useAuth();
  const dispatch = useDispatch();

  const handleTriggerMessageToAPI = async (payload) => {
  
    try {
      let URL=""
      let flowPayload={}
      let response = {}
      if(azureRoute == 2){
        URL = `${process.env.REACT_APP_BASE_URL}openAIchat/`;
        flowPayload=payload
        const result = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flowPayload),
        }); 
        response =result
        if (response.ok) {
          return response; // Return the fetch response (which supports streaming)
        } else {
          console.error(`Unexpected response status: ${response.status}`);
          // throw new Error(`Failed to send message. Status code: ${response.status}`);
        }


      }else{
        URL = `${baseURL}/api/v1/prediction/${flowiseId}`; // localhost..
        flowPayload={
          "question": payload?.message,
          "streaming":true,
          "threadId":chatThreadDetails?._id,
          "userId":userId,
          modelType:'aiChat'
        }
        const result = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flowPayload),
        }); 
        if (result.ok) {
          return result; // Return the fetch response (which supports streaming)
        } else {
          console.error(`Unexpected response status: ${result.status}`);
          throw new Error(`Failed to send message. Status code: ${result.status}`);
        }
      }
      // Using fetch for streaming support

      // Check if the response is OK
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
      throw new Error(`Error: ${error.message}`);
    }
  };

  const updateAIMessage = (content) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessageIndex = updatedMessages.length - 1;

      if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].role === "assistant") {
        updatedMessages[lastMessageIndex] = generateAIMessageStructure(content);
      }

      return updatedMessages;
    });
  };

  const handleSendMessage = async (message) => {
    setLoading(true);

    const payload = {
      userId,
      threadId: currentActiveThreadId,
      message: message,
      multimodalImage: base64Image || "", // Use base64Image in the payload
    };
    // Add the user message and attach the image if available
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...generateUserMessageStructure(message),
        multimodalImage: base64Image || "", // Add the base64 image directly in the message
      },
      generateAIMessageStructure(""), // Placeholder for AI message
    ]);

    // Trigger the API call with payload
    const newMessageRequest = await handleTriggerMessageToAPI(payload);

    // if(azureRoute === 2){
      if (newMessageRequest.body) {
        let finalString = ''
        const reader = newMessageRequest.body.getReader();
        const decoder = new TextDecoder();
        const parser = createParser((event) => {
          if (event.type === "event" && event.data) {
            try {
              const json = JSON.parse(event.data);
              if (json.type === "content") {
                const content = json.response.choices[0].message.content || "";
                updateAIMessage(content); // Update message as data streams in
              }else{
                finalString += json?.data
                if(json?.event && !['end','metadata'].includes(json.event)){
                  updateAIMessage(finalString || ''); // Update message as data streams in
                }
              }
            } catch (error) {
              console.error("JSON Parse Error:", error);
            }
          }
        });
  
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
  
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            parser.feed(chunk); // Pass the chunk to the eventsource-parser
          }
        }
      } else {
        console.error("Response body is not a readable stream.");
      }
      dispatch(reset());
      setLoading(false);
    // }else if(azureRoute === 3){
    //   updateAIMessage(newMessageRequest?.text||"")
    //   dispatch(reset());
    //   setLoading(false);

    // }


    // Clear the input image after sending
  };

  const handleFetchAllMessage = async () => {
    // Validate the required parameters
    if (!orgId || !selectedProjectId || !userId || !currentActiveThreadId) {
      alert("Missing required parameters");
      return;
    }

    // Build the API endpoint URL
    const URL = `${process.env.REACT_APP_BASE_URL}openAIchat/organizations/${orgId}/projects/${selectedProjectId}/users/${userId}/thread/${currentActiveThreadId}`;

    // { organizationId, projectId, userId, threadId } =req.params;
    // { title } = req.body;

    try {
      // Make the GET request to fetch the current chat thread
      const response = await axios.get(URL);

      // Destructure the necessary data from the response
      const {
        data: { data: responseData },
        status,
      } = response;

      const {
        name,
        bookmarked,
        createdAt,
        is_active,
        is_deleted,
        project_id,
        type,
        _id,
        chat_history,
        persona_message,
        persona_message_title,
        chat_thread_type
      } = responseData;

      if(chat_thread_type === "orchestrate"){
        dispatch(setChatRoute(3))
      }
      else if(chat_thread_type === "prompt"){
        dispatch(setChatRoute(2))
      }
      const chatThreadDetails = {
        name,
        bookmarked,
        createdAt,
        is_active,
        is_deleted,
        project_id,
        type,
        _id,
      };

      setChatThreadDetails(chatThreadDetails);

      // Handle successful response
      if (status === 200) {
        return chat_history; // Return the fetched chat thread data
      } else {
        console.error(`Unexpected response status: ${status}`);
        alert(`Failed to fetch the chat thread. Status code: ${status}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Thread not found (404)";
      console.error("Error fetching chat thread:", errorMsg);

      // Handle specific 404 error case
      if (error.response?.status === 404) {
        alert("Chat thread not found. It might have been already deleted.");
      } else {
        // General error alert for other cases
        alert(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (azurePersona != undefined) {
      setPersonaDetails({
        persona_message: azurePersona?.data?.data?.[0]?.persona_message,
        persona_message_title: azurePersona?.data?.data?.[0]?.persona_message_title,
      });
    }
  }, [azurePersona]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);

      try {
        const _fetchedMessages = await handleFetchAllMessage();
        // If fetched messages exist, set them. Otherwise, reset to initial state.
        if (_fetchedMessages) {
          setMessages(_fetchedMessages);
        } else {
          setMessages([initialMessage]);
        }
      } catch (error) {
        console.error("Error fetching messages", error);
        // In case of an error, reset messages to the default initial state.
        setMessages([initialMessage]);
      }

      setLoading(false);
    };

    // Reset messages when sidebarChatInstance length changes
    setMessages([initialMessage]);
    getMessages();

    // Adding sidebarChatInstance.length and currentActiveThreadId as dependencies
  }, [currentActiveThreadId]);

  useEffect(() => {
    if (messages.length > 1 && endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([initialMessage]);
  }, [sidebarChatInstance.chats.length]);

  return (
    <>
      <main className="flex flex-1 relative flex-col">
        <ChatHeader
          chatDocuments={props.chatDocuments}
          extensions={props.extensions}
          chatThreadDetails={chatThreadDetails}
          personaDetails={personaDetails}
        />
        <ChatMessageContainer>
          <ChatMessageContentArea>
            {messages
              .filter((data) => data.role !== "function")
              .map((message) => (
                <ChatMessageArea
                  key={message.id}
                  profileName={message.name}
                  role={message.role}
                  onCopy={() => {
                    navigator.clipboard.writeText(message.content);
                  }}
                  profilePicture={
                    message.role === "assistant" ? "/ai-icon.png" : "" // Replace with actual user image if available
                  }
                >
                  {message?.multi_modal_image && (
                    <img
                      src={message.multi_modal_image}
                      alt="Uploaded Image"
                      // className="max-w-full h-auto rounded-md mt-2"
                    />
                  )}
                  <MessageContent message={message} />
                </ChatMessageArea>
              ))}
            {loading && <ChatLoading />}
            <div ref={endOfMessagesRef} /> {/* This div helps in scrolling */}
          </ChatMessageContentArea>
        </ChatMessageContainer>
      </main>
      <ChatInput responseLoading={loading} onSendMessage={handleSendMessage} />
    </>
  );
};
