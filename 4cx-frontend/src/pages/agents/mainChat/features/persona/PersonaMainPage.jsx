import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pagination, Stack } from "@mui/material";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Hero } from "ui/hero";
import { ChevronDown, Search, VenetianMask, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import { Input } from "ui/input";
import { DropdownMenu } from "ui/dialog";
import { DropdownMenuItem } from "ui/dialog";
import { DropdownMenuTrigger } from "ui/dialog";
import { DropdownMenuContent } from "ui/dialog";
import { Button } from "ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { updateEditPromptData } from "store/features/promptSlice";
import { useDispatch } from "react-redux";
import { setPromptLoading } from "store/features/promptSlice";
import fetchData from "services/api";
import { updatePromptData } from "store/features/promptSlice";
import { updateFlowData } from "store/features/promptSlice";
import { updateVersionChanged } from "store/features/reactFlowSlice";
import { updatePromptId } from "store/features/promptSlice";
import { updateVersion } from "store/features/promptSlice";
import debounce from "lodash/debounce";
import { LoadingIndicator } from "ui/loading";
import { updateActivePersona } from "store/features/chatPersonaSlice";
import { clearActivePersona } from "store/features/chatPersonaSlice";
import { CardFooter } from "ui/card";
import axios from "axios";
import { setActiveChatThread } from "store/features/activeAzureChatThreadSlice";
import { setRoute } from "store/features/azureChatRoutesSlice";
import { addChat } from "store/features/azureChatSidebar";
import parse from "html-react-parser";
import { marked } from "marked";
import processHtmlMarkdown from "utils/processHTMLMarkdown";
import PersonUnavailable from "./personUnavailable";
import PageLoader from "components/page-loader";

const ChatPersonaPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedPersona, setSelectedPersona] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectListingState, setProjectListingState] = useState({
    anchorEl: null,
    subMenuAnchorEl: null,
    promptEditData: [],
    projectPromptList: [],
  });
  const { orgId, userId } = useAuth();
  const versionStatus = useSelector((state) => state.reactFlow.isVersion);
  const reduxData = useSelector((state) => state.prompt.data);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const activeChatPersona = useSelector((state) => state.azureChatPersona.activePersona);

  const [triggerVersionChange, setTriggerVersionChange] = useState(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  // PAGINATION CONFIGURATIONS
  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const currentItems = projectListingState.projectPromptList.slice(startIndex, endIndex);

  const handlePaginationChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (prompt) => {
    // setSelectedPersona(prompt._id);
    dispatch(updateActivePersona(prompt));
  };

  const fetchProjectData = useCallback(async () => {
    dispatch(setPromptLoading(true));

    try {
      setLoading(true)
      const response = await fetchData(
        `/prompt?organizationId=${orgId}&projectId=${projectId}`,
        "GET"
      );

      if (response?.data) {
        setProjectListingState((prevState) => ({
          ...prevState,
          projectPromptList: response.data,
        }));
        dispatch(updateEditPromptData(response?.data));
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading(false)
      dispatch(setPromptLoading(false));
    }
  }, [orgId, projectId, dispatch]);

  const fetchVersionData = async (promptId, version) => {
    const response = await fetchData(`/prompt/${promptId}/version/${version}`, "GET");
    dispatch(updatePromptData(response?.data));
    dispatch(updateFlowData(response?.data));
    dispatch(updateVersionChanged(true));
    dispatch(setPromptLoading(false));
  };

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      if (!orgId || !projectId) throw new Error("Required Parameters are missing!");

      const URL = `${process.env.REACT_APP_BASE_URL}prompt?organizationId=${orgId}&projectId=${projectId}&search=${query}&limit=10&skip=0`;

      const response = await fetchData(URL, "GET");

      setProjectListingState((prevState) => ({
        ...prevState,
        projectPromptList: response.data,
      }));
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setProjectListingState({
      ...projectListingState,
      anchorEl: null,
      subMenuAnchorEl: null,
    });
  };

  const handleVersionChange = useCallback(
    (action) => {
      const promptId = projectListingState?.promptEditData?.prompt_id;

      if (!promptId) {
        console.error("Prompt ID is undefined, cannot fetch version data");
        return;
      }

      dispatch(setPromptLoading(true));
      const versionNumber = parseInt(action.replace("version", ""), 10);
      dispatch(updateVersion(versionNumber));
      dispatch(updatePromptId(promptId));
      fetchVersionData(promptId, versionNumber);
      handleCloseEdit();
    },
    [projectListingState?.promptEditData?.prompt_id, dispatch]
  );

  const handleTriggerVersionChange = (e, _prompt, version) => {
    e.stopPropagation();
    setProjectListingState({
      ...projectListingState,
      anchorEl: e.currentTarget,
      promptEditData: _prompt,
    });
    setTriggerVersionChange([e, version]);
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => fetchSearchResults(query), 300),
    [orgId, projectId]
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    debouncedFetchSearchResults(value);
  };

  // ========================== CUSTOM PERSONA CHAT THREAD FUNCTIONALITY =========================

  const handleCreateChatThread = async (promptId, version) => {
    // Validate required parameters
    if (!promptId || !version) {
      throw new Error("organizationId, projectId, and userId are required");
    }

    // Endpoint URL with parameters
    const URL = `${process.env.REACT_APP_BASE_URL}prompt/${promptId}/version/${version}`;

    try {
      // Making the POST request with Axios
      const { data: axiosData } = await axios.post(URL);

      const { data } = axiosData;

      // Return the full response object
      return data;
    } catch (error) {
      // Log and rethrow error
      console.error("Error creating chat thread");
      throw error;
    }
  };

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

  const handleRedirectToCustomThread = async (promptId, version) => {
    // get the chat-thread and then create a new thread out of it

    const generateChatThreadInstance = await handleCreateChatThread(promptId, version);


    // setting the chat thread id to new instance
    if (generateChatThreadInstance) {
      dispatch(setActiveChatThread(generateChatThreadInstance));
      dispatch(handleChatCreationAndNavigation(generateChatThreadInstance));
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  useEffect(() => {
    if (versionStatus) {
      setProjectListingState({
        ...projectListingState,
        projectPromptList: reduxData,
      });
    }
  }, [reduxData]);

  useEffect(() => {
    if (triggerVersionChange) {
      const [action, version] = triggerVersionChange;
      handleVersionChange(`version${version}`);
      setTriggerVersionChange(null); // Reset the state
    }
  }, [triggerVersionChange, handleVersionChange]);

  return (
    <ScrollArea className="flex-1 h-full flex flex-col">
      <main className="flex flex-1 flex-col px-10">
        <Hero
          title={
            <>
              <VenetianMask size={36} strokeWidth={1.5} /> Persona
            </>
          }
          description={`  Persona is a representation of a personality that you can use to have a conversation with.`}
        />
        <div className="container mx-auto p-4" ref={containerRef}>
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
            {activeChatPersona._id && (
              <div className="flex items-center space-x-2">
                <Button
                  className="border-red-500 text-red-500 hover:bg-red-100"
                  variant="outline"
                  onClick={() => dispatch(clearActivePersona())}
                >
                  <X className="h-4 w-4" /> Deselect
                </Button>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Options</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                    <DropdownMenuItem>Option 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            )}
          </div>

          {loading ? 
          (
            <LoadingIndicator isLoading={loading} />
          ) 
          : currentItems.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {currentItems.map((prompt, index) => (
                <Card
                  key={prompt.id}
                  className={`cursor-pointer transition-all ${
                    activeChatPersona._id === prompt._id ? "ring-2 ring-red-700" : "hover:shadow-md"
                  }`}
                  onClick={() => handleCardClick(prompt)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
                    <CardTitle className="text-sm font-medium">{prompt.prompt_title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-dashed bg-red-50 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Version: {prompt.version}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {prompt.versions.map((version) => (
                          <DropdownMenuItem
                            key={version}
                            onClick={(e) => handleTriggerVersionChange(e, prompt, version)}
                          >
                            Version: {version}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground truncate">
                      {processHtmlMarkdown(prompt.prompt_text)}
                    </p>
                  </CardContent>
                  {activeChatPersona._id === prompt._id && (
                    <CardFooter>
                      <Button
                        onClick={() =>
                          handleRedirectToCustomThread(
                            activeChatPersona.prompt_id,
                            activeChatPersona.version
                          )
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
      </main>
      {/* PAGINATION COMPONENT */}
      <div className="flex mb-10 justify-center space-x-2">
        <Stack spacing={4}>
          <Pagination
            count={Math.ceil(projectListingState.projectPromptList.length / 6)}
            page={currentPage}
            onChange={handlePaginationChange}
            shape="rounded"
          />
        </Stack>
      </div>
    </ScrollArea>
  );
};

export default ChatPersonaPage;
