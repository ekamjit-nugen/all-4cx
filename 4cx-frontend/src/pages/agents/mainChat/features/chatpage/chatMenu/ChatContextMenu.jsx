import React, { useState } from "react";
import { MoreVertical, Trash } from "lucide-react";
// import { DropdownMenuItemWithIcon } from "./chat-menu-item"; // Adjust the import path as needed
// import { DeleteAllChatThreads } from "./chat-menu-service"; // Adjust the import path as needed

import { LoadingIndicator } from "ui/loading";
import { DropdownMenuItemWithIcon } from "./ChatMenuItem";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "ui/dialog";

const ChatContextMenu = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (window.confirm("Are you sure you want to delete all the chat threads?")) {
      setIsLoading(true);
      //   const response = await DeleteAllChatThreads();

      if (response.status === "OK") {
        setIsLoading(false);
        window.location.href = "/chat"; // Redirect to the chat page
      } else {
        alert(response.errors.map((e) => e.message).join(", ")); // Display error messages
        setIsLoading(false);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading}>
        {isLoading ? (
          <LoadingIndicator isLoading={isLoading} />
        ) : (
          <MoreVertical size={18} aria-label="Chat Menu Dropdown Menu" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItemWithIcon onClick={handleAction}>
          <Trash size={18} />
          <span>Delete all</span>
        </DropdownMenuItemWithIcon>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ChatContextMenu };
