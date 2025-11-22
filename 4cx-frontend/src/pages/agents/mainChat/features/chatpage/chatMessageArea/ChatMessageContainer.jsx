import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { forwardRef } from "react";

const ChatMessageContainer = (props, ref) => {
  return (
    <ScrollArea ref={ref} className="flex-1 h-full overflow-auto" type="always">
      {props.children}
    </ScrollArea>
  );
};

export default forwardRef(ChatMessageContainer);
