// import { ChatMenuHeader } from "@/features/chat-page/chat-menu/chat-menu-header";
// import { MenuTray } from "@/features/main-menu/menu-tray";
// import { DisplayError } from "@/features/ui/error/display-error";
// import { ScrollArea } from "@/features/ui/scroll-area";

import { cn } from "utils/utils";
import { ChatMenu } from "./features/chatpage/chatMenu/ChatMenu";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export default async function MainChatLayout({ children }) {
  return (
    <div className={cn("flex flex-1 items-stretch")}>
      <div className="flex-1 flex">
        <MenuTray>
          <ChatMenuHeader />
          <ScrollArea>
            <ChatMenu menuItems={[]} />
          </ScrollArea>
        </MenuTray>
        {children}
      </div>
    </div>
  );
}
