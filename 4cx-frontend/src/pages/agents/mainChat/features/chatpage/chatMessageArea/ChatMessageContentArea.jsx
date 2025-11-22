import React, { forwardRef } from "react";

const ChatMessageContentArea = (props, ref) => {
  return (
    <div
      ref={ref}
      className="container max-w-3xl relative flex flex-col gap-16 pb-24 pt-16 px-5" // Adjust bottom padding to avoid overlap
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {props.children}
    </div>
  );
};

export default forwardRef(ChatMessageContentArea);
