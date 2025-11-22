import { Loader, Send } from "lucide-react";
import React from "react";
import { Button } from "ui/button"; // assuming you have a Loader component

export const SubmitChat = React.forwardRef(({ responseLoading, ...props }, ref) => (
  <Button
    size="icon"
    type="submit"
    variant={"ghost"}
    disabled={responseLoading}
    {...props}
    ref={ref}
    aria-label="Submit chat input"
  >
    {responseLoading ? (
      <div className="loader-container">
        <Loader size={20} className="animate-spin" />
      </div>
    ) : (
      <Send size={20} />
    )}
  </Button>
));
SubmitChat.displayName = "SubmitChat";
