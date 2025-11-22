import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pagination, Stack } from "@mui/material";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ChatFlowsHero from "./chat-flows-hero";
import { useDispatch } from "react-redux";
import { Search, X } from "lucide-react";
import { LoadingIndicator } from "ui/loading";
import { CardHeader } from "ui/card";
import { CardTitle } from "ui/card";
import { DropdownMenu } from "ui/dialog";
import { DropdownMenuTrigger } from "ui/dialog";
import { Button } from "ui/button";
import { CardContent } from "ui/card";
import { Card } from "ui/card";
import { CardFooter } from "ui/card";
import { debounce } from "lodash";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { Input } from "ui/input";
import fetchData from "services/api";
import PersonUnavailable from "../persona/personUnavailable";
import { updateActivePersona } from "store/features/chatPersonaSlice";
import { clearActivePersona } from "store/features/chatPersonaSlice";
import { setActiveChatThread } from "store/features/activeAzureChatThreadSlice";
import { addChat } from "store/features/azureChatSidebar";
import { setRoute } from "store/features/azureChatRoutesSlice";
import axios from "axios";
import { setFlowiseId } from "store/features/azureChatRoutesSlice";
import { useLocation } from "react-router-dom";

export default function AIChatChatFlows() {
  // ! ============================= (STATE) ====================================
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectListingState, setProjectListingState] = useState({
    anchorEl: null,
    subMenuAnchorEl: null,
    promptEditData: [],
    projectPromptList: [],
  });
  const [flowsData, setFlowsData] = useState([]);

  // ! ============================= (CONTEXT AND REFS) =========================
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { orgId, userId } = useAuth();

  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;

  const projectId = useSelector((state) => state.projectIdList.projectId);
  const currentItems = projectListingState.projectPromptList.slice(startIndex, endIndex);
  const activeChatPersona = useSelector((state) => state.azureChatPersona.activePersona);
  const azureRoute = useSelector((state)=>state.azureChatRoutes.currentChatRoute)
  const {state} = useLocation()

  // ! ============================= (API REQUEST) ==============================
  const handleSearchChatflowsRequest = useCallback(() => {}, []);

  const handleFetchChatFlowsRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `/orchestrate/organization/${orgId}/projects/${projectId}/flow`,
        "GET"
      );

      if (response.data && response.data.length > 0) {
        setFlowsData(response.data);
      } else {
        console.error("Expected an array of data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, userId]);

  const handleChatThreadCreationRequest = async (flowId) => {
    dispatch(setFlowiseId(flowId))
    // Validate required parameters
    // Endpoint URL with parameters
// /organization/:organizationId/projects/:projectId/orchestrate/:flowId/chatFlow
    const URL = `${process.env.REACT_APP_BASE_URL}orchestrate/chatFlow/${flowId}`;

    try {
      // Making the POST request with Axios
      const { data: axiosData } = await axios.get(URL);

      const { data } = axiosData;

      // Return the full response object
      return data;
    } catch (error) {
      // Log and rethrow error
      console.error("Error creating chat thread");
      throw error;
    }
  };

  // ! ======================= (HANDLE CHANGE AND HANDLE SUBMIT) =================
  const handleRedirectToCustomThread = async (flowId) => {
    // get the chat-thread and then create a new thread out of it
    const generateChatThreadInstance = await handleChatThreadCreationRequest(flowId);

    // setting the chat thread id to new instance
    if (generateChatThreadInstance) {
      dispatch(setActiveChatThread(generateChatThreadInstance));
      dispatch(handleChatCreationAndNavigation(generateChatThreadInstance));
    }
  };

  const handlePaginationChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(()=>{
    if(state?.id){
      handleRedirectToCustomThread(state?.id)
    }
  },[state])
  const handleChatCreationAndNavigation = (chatThreadInstance) => async (dispatch) => {
    const { name, _id } = chatThreadInstance;
    try {
      // Dispatch addChat action
      const chatData = {
        _id, // Assuming uuidv4 is imported
        title: name,
        timeStamp: new Date().toISOString(),
      };

      await dispatch(addChat(chatData));
      await dispatch(setActiveChatThread(chatThreadInstance));

      // After chat creation, set the route
      dispatch(setRoute(11));
    } catch (error) {
      console.error("Error adding chat and setting route:", error);
    }
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => handleSearchChatflowsRequest(query), 300),
    [orgId, projectId]
  );

  const handleCardClick = (prompt) => {
    dispatch(updateActivePersona(prompt));
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    debouncedFetchSearchResults(value);
  };

  useEffect(() => {
    handleFetchChatFlowsRequest();
  }, [handleFetchChatFlowsRequest]);

  // ! ======================= UI RENDER SECTION =================================
  return (
    <ScrollArea className="flex-1 h-full flex flex-col">
      <main className="flex flex-col px-10">
        <ChatFlowsHero />
      </main>
      {/* CHAT FLOW CARDS */}
      <div className="felx flex-1 flex-col container mx-auto p-4" ref={containerRef}>
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-1/2 xl:w-1/4">
            <Input
              type="text"
              placeholder="Search personas..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {activeChatPersona.id && (
            <div className="flex items-center space-x-2">
              <Button
                className="border-red-500 text-red-500 hover:bg-red-100"
                variant="outline"
                onClick={() => dispatch(clearActivePersona())}
              >
                <X className="h-4 w-4" /> Deselect
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingIndicator isLoading={isLoading} />
        ) : flowsData.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {flowsData.map((prompt, index) => (
              <Card
                key={prompt.id}
                className={`cursor-pointer transition-all ${
                  activeChatPersona.id === prompt.id ? "ring-2 ring-red-700" : "hover:shadow-md"
                }`}
                onClick={() => handleCardClick(prompt)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                  <CardTitle className="text-sm font-medium">{prompt.name}</CardTitle>
                 {azureRoute === 2 && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed bg-red-50 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Version: 01
                        {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
                      </Button>
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent align="end">
                      {prompt.versions.map((version) => (
                        <DropdownMenuItem
                          key={version}
                          //   onClick={(e) => handleTriggerVersionChange(e, prompt, version)}
                        >
                          Version: {version}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent> */}
                  </DropdownMenu>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground truncate">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </CardContent>
                {activeChatPersona.id === prompt.id && (
                  <CardFooter>
                    <Button
                      onClick={() =>
                        handleRedirectToCustomThread(activeChatPersona.id)
                      }
                      className="w-full bg-slate-900 hover:bg-slate-950"
                    >
                      Chat
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <PersonUnavailable />
        )}
      </div>
      {/* PAGINATION COMPONENT */}
      <div className="flex mb-10 justify-center space-x-2">
        <Stack spacing={4}>
          <Pagination
            // count={Math.ceil(projectListingState.projectPromptList.length / 6)}
            count={10}
            page={currentPage}
            onChange={handlePaginationChange}
            shape="rounded"
          />
        </Stack>
      </div>
    </ScrollArea>
  );
}
