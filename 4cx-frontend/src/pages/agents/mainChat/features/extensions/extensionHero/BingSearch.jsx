import React from "react";
import { HeroButton } from "ui/hero";
import { Globe } from "lucide-react";
// import { extensionStore } from "../extension-store";

const BingSearch = () => {
  const uniqueId = () => {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const nanoid = customAlphabet(alphabet, 36);
    return nanoid();
  };

  const newExample = () => {
    const bingExample = {
      createdAt: new Date(),
      description: "Bring up to date information with Bing Search",
      id: "",
      name: "Bing Search",
      executionSteps: `You are an expert in searching the web using BingSearch function.`,
      functions: [
        {
          code: `{
"name": "BingSearch",
"parameters": {
  "type": "object",
  "properties": {
    "query": {
      "type": "object",
      "description": "Use this as the search query parameters",
      "properties": {
        "BING_SEARCH_QUERY": {
          "type": "string",
          "description": "Search query from the user",
          "example": "What is the current weather in Sydney, Australia?"
        }
      },
      "example": {
        "BING_SEARCH_QUERY": "What is the current weather in Sydney, Australia?"
      },
      "required": ["BING_SEARCH_QUERY"]
    }
  },
  "required": ["query"]
},
"description": "Use BingSearch to search for information on the web to bring up to date information"
}`,
          endpoint: "https://api.bing.microsoft.com/v7.0/search?q=BING_SEARCH_QUERY",
          id: uniqueId(),
          endpointType: "GET",
          isOpen: false,
        },
      ],
      headers: [
        {
          id: uniqueId(),
          key: "Ocp-Apim-Subscription-Key",
          value: "YOUR API KEY HERE",
        },
      ],
      isPublished: false,
      type: "EXTENSION",
      userId: "",
    };

    extensionStore.openAndUpdate(bingExample);
  };

  return (
    <HeroButton
      title="Bing Search"
      description="Bring up to date information with Bing Search"
      icon={<Globe />}
      onClick={newExample}
    />
  );
};

export default BingSearch;
