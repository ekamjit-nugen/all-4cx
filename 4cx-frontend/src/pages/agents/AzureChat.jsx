import React from "react";
import MainChatPage from "./mainChat/MainChatPage";
import { MenuTray } from "./mainChat/features/chatpage/chatMenu/ChatMenuTray";
import { ChatMenuHeader } from "./mainChat/features/chatpage/chatMenu/ChatMenuHeader";
import { ChatMenu } from "./mainChat/features/chatpage/chatMenu/ChatMenu";
import { MainMenu } from "./mainChat/menuOptions/MainMenu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useSelector } from "react-redux";
import ChatPersonaPage from "./mainChat/features/persona/PersonaMainPage";
import ChatSamplePromptPage from "./mainChat/features/prompts/PromptMainPage";
import { ChatPage } from "./mainChat/features/chatpage/ChatMainPage";
import AIChatChatFlows from "./mainChat/features/chat-flows";

const AzureChat = () => {
  const currentRoute = useSelector((state) => state.azureChatRoutes.currentRoute);

  const renderChatPage = () => {
    switch (currentRoute) {
      case 1:
        return <MainChatPage />;
      case 2:
        return <ChatPersonaPage personas={[]} />;
      case 3:
        return <AIChatChatFlows />;
      case 4:
        return <ChatSamplePromptPage />;
      case 11:
        return <ChatPage />;
      default:
        return <MainChatPage />;
    }
  };

  return (
    <div className="fixed top-[13%] w-[79%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[79%] 2xl:w-[85%] h-[83%]">
      <main className="h-full w-full flex flex-col bg-background">
        <div className="flex-1 flex overflow-hidden">
          <MainMenu />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
              <MenuTray className="overflow-auto">
                <div className="sticky top-0 w-full z-10 bg-white">
                  <ChatMenuHeader />
                </div>
                <ScrollArea>
                  <ChatMenu menuItems={[]} />
                </ScrollArea>
              </MenuTray>
              <div className="flex-1 overflow-auto">{renderChatPage()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AzureChat;
