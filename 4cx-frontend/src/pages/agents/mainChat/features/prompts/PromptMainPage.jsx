import React, { useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PromptHero } from "./PromptHero/PromptHero";

// import { DisplayError } from "../ui/error/display-error";
// import { AddPromptSlider } from "./add-new-prompt";
// import { PromptCard } from "./prompt-card";
// import { PromptHero } from "./prompt-hero/prompt-hero";
// import { FindAllPrompts } from "./prompt-service";

const ChatSamplePromptPage = (props) => {
  const [promptsResponse, setPromptsResponse] = useState(null);

  //   useEffect(() => {
  //     const fetchPrompts = async () => {
  //       const response = await FindAllPrompts();
  //       setPromptsResponse(response);
  //     };

  //     fetchPrompts();
  //   }, []);

  //   if (!promptsResponse) {
  //     return <div>Loading...</div>;
  //   }

  //   if (promptsResponse.status !== "OK") {
  //     return <DisplayError errors={promptsResponse.errors} />;
  //   }

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <PromptHero />
        <div className="container max-w-4xl py-3">
          <div className="grid grid-cols-3 gap-3">
            {/* {promptsResponse.response.map((prompt) => (
              <PromptCard prompt={prompt} key={prompt.id} showContextMenu />
            ))} */}
          </div>
        </div>
        {/* <AddPromptSlider /> */}
      </main>
    </ScrollArea>
  );
};

export default ChatSamplePromptPage;
