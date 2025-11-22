import React, { useState } from "react";

import { BookmarkCheck, MoreVertical, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { LoadingIndicator } from "ui/loading";

import { cn } from "utils/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui/dialog";

// import {
//   BookmarkChatThread,
//   DeleteChatThreadByID,
//   UpdateChatThreadTitle,
// } from "./chat-menu-service";

export const ChatMenuItem = (props) => {
  const navigate = useNavigate();
  const { isLoading, handleAction } = useDropdownAction({
    chatThread: props.chatThread,
  });

  const { chatThread, onClick } = props;

  return (
    <div
      className="flex group hover:bg-muted pr-3 text-muted-foreground rounded-sm hover:text-muted-foreground cursor-pointer"
      onClick={() => onClick(chatThread)}
    >
      <div
        className={cn(
          "flex-1 flex items-center gap-2 p-3 overflow-hidden text-sm",
          window.location.pathname.startsWith(props.href) && props.href !== "/"
            ? "text-primary"
            : ""
        )}
        onClick={() => navigate(props.href)}
      >
        {props.children}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={false}>
          {isLoading ? (
            <LoadingIndicator isLoading={isLoading} />
          ) : (
            <MoreVertical size={18} aria-label="Chat Menu Item Dropdown Menu" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {/* <DropdownMenuItemWithIcon onClick={async () => await handleAction("bookmark")}>
            <BookmarkCheck size={18} />
            <span>Bookmark</span>
          </DropdownMenuItemWithIcon> */}
          <DropdownMenuItemWithIcon onClick={() => props.handleModifyChatThreads(chatThread)}>
            <Pencil size={18} />
            <span>Rename</span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuSeparator />
          <DropdownMenuItemWithIcon onClick={() => props.handleDeleteChatThreads(chatThread._id)}>
            <Trash size={18} />
            <span>Delete</span>
          </DropdownMenuItemWithIcon>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const useDropdownAction = (props) => {
  const { chatThread } = props;
  const [isLoading, setIsLoading] = useState(false);

  // const handleAction = async (action) => {
  //   setIsLoading(true);
  //   switch (action) {
  //     case "bookmark":
  //       // await BookmarkChatThread({ chatThread });
  //       break;
  //     case "rename":
  //       const name = window.prompt("Enter the new name for the chat thread:");
  //       if (name !== null) {
  //         //   await UpdateChatThreadTitle({ chatThread, name });
  //       }
  //       break;
  //     case "delete":
  //       if (window.confirm("Are you sure you want to delete this chat thread?")) {
  //         //   await DeleteChatThreadByID(chatThread.id);
  //       }
  //       break;
  //   }
  //   setIsLoading(false);
  // };

  return {
    isLoading,
    // handleAction,
  };
};

export const DropdownMenuItemWithIcon = (props) => {
  return (
    <DropdownMenuItem className="flex gap-2" onClick={props.onClick}>
      {props.children}
    </DropdownMenuItem>
  );
};
