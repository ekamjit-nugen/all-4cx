import React from "react";

export const ChatGroup = (props) => {
  return (
    <div className="flex flex-col">
      <div className="text-sm font-extrabold text-muted-foreground p-3">{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
};
