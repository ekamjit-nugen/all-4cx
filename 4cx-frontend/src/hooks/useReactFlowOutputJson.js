import { useDispatch } from "react-redux";
import { updateShowOutputData } from "store/features/reactFlowSlice";

const useReactFlowOutputJson = () => {
  const dispatch = useDispatch();

  const extractRelevantData = (data) => {
    if (!data?.nodes) return {};

    let inputQuery = "";
    let chatHistory = [];
    let promptText = "";
    let searchIndex = "";
    let chatGptMessage = [];

    const nodeHandlers = {
      inputNode: (nodeData) => {
        inputQuery = nodeData?.textFields?.map((field) => field);
      },

      text: (nodeData) => {
        const { json_prompt_flow, ...filteredPromptData } = nodeData?.promptData?.promptData || {};
        promptText = filteredPromptData;
      },

      chatHistory: (nodeData) => {
        chatHistory = nodeData.chatHistory;
      },

      search: (nodeData) => {
        searchIndex = nodeData.selectedValue;
      },
      chat: (nodeData) => {
        chatGptMessage.push(nodeData.chatMessageData);
      },
    };

    data.nodes.forEach((node) => {
      const { type, data: nodeData } = node;
      if (nodeHandlers[type]) {
        nodeHandlers[type](nodeData);
      }
    });

    const outputData = {
      input_query: inputQuery,
      chat_history: chatHistory,
      prompt_text: promptText,
      search_index: searchIndex,
      chat_gpt_message: chatGptMessage.join(", "),
    };

    dispatch(updateShowOutputData(outputData));

    return outputData;
  };

  return { extractRelevantData };
};

export default useReactFlowOutputJson;
