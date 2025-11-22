import React from "react";
import { LoadingIndicator } from "ui/loading";

// interface ChatInputAreaProps {
//   status?: string;
// }

export const ChatInputForm = React.forwardRef(({ status, ...props }, ref) => (
  <div className="sticky bottom-0 w-full bg-white">
    <div className="container max-w-3xl mx-auto flex items-center gap-2 p-2">
      <div className="flex-1">
        <ChatInputStatus status={status} />
        <div className="backdrop-blur-xl bg-background/70 rounded-md overflow-hidden focus-within:border-primary border">
          <form ref={ref} className="flex items-center h-auto" {...props}>
            {props.children}
          </form>
        </div>
      </div>
    </div>
  </div>
));
ChatInputForm.displayName = "ChatInputArea";

export const ChatInputStatus = (props) => {
  if (props.status === undefined || props.status === "") return null;
  return (
    <div className="flex justify-center mb-1">
      <div className="border bg-background p-2 px-5 rounded-full flex gap-2 items-center text-sm">
        <LoadingIndicator isLoading={true} /> {props.status}
      </div>
    </div>
  );
};

export const ChatInputActionArea = (props) => {
  return <div className="flex justify-between p-2">{props.children}</div>;
};

export const ChatInputPrimaryActionArea = (props) => {
  return <div className="flex">{props.children}</div>;
};

export const ChatInputSecondaryActionArea = (props) => {
  return <div className="flex">{props.children}</div>;
};
