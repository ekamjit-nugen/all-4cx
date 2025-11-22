import { VenetianMask } from "lucide-react";
import { PersonaDetail } from "./PersonalDetail";
import { useSelector } from "react-redux";

const ChatHeader = (props) => {
  const chatThreadDetails = useSelector((state) => state.activeChatThread.activeChatThread);
  const defaultPersona = "Azure Chat Default";

  return (
    <div className="bg-background border-b flex items-center py-2">
      <div className="container max-w-3xl flex justify-between items-center px-5">
        <div className="flex flex-col">
          <span>{chatThreadDetails ? chatThreadDetails.name : ""}</span>
          <span className="text-sm text-muted-foreground flex gap-1 items-center">
            <VenetianMask size={18} />
            {defaultPersona}
          </span>
        </div>
        <div className="flex gap-2">
          {chatThreadDetails && chatThreadDetails.persona_message_title ? (
            <PersonaDetail personaDetails={chatThreadDetails} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
