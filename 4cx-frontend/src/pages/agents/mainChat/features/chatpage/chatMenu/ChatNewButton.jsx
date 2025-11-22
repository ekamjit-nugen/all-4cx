import React from "react";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom"; // This import assumes you're using the latest React features
import { LoadingIndicator } from "ui/loading";
import { Button } from "ui/button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setRoute } from "store/features/azureChatRoutesSlice";
import { Box } from "@mui/material";

const NewChatButton = ({ addChatHandler }) => {
  //   const { pending } = useFormStatus();
  const pending = false;

  return (
    <Button
      onClick={addChatHandler}
      aria-disabled={pending}
      size="default"
      className="flex gap-2"
      variant="outline"
    >
      {/* {pending ? <LoadingIndicator isLoading={pending} /> : <Plus size={18} />} */}
      <Plus size={15} />
      <Box sx={{ fontSize: "12px" }}>New Chat</Box>
    </Button>
  );
};

export { NewChatButton };
