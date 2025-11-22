import React from "react";
import { Markdown } from "./markdown/Markdown";

const MessageContent = ({ message }) => {
  // Conditional rendering based on the message role
  if (message.role === "assistant" || message.role === "user") {
    return (
      <>
        {/* Uncomment this line and add Markdown support if needed */}
        <Markdown content={message.content} />
        {/* Render the base64 image if present */}
        {message.multi_modal_image && (
          <img
            src={message.multi_modal_image}
            alt="Uploaded Image"
            className="max-w-full h-auto rounded-md"
          />
        )}
      </>
    );
  }

  if (message.role === "tool" || message.role === "function") {
    return null;
    // return (
    //   <div className="py-3">
    //     <Accordion type="multiple" className="bg-background rounded-md border p-2">
    //       <AccordionItem value="item-1">
    //         <AccordionTrigger className="text-sm py-1 items-center gap-2">
    //           <div className="flex gap-2 items-center">
    //             <FunctionSquare size={18} strokeWidth={1.4} className="text-muted-foreground" />
    //             Show {message.name} {message.name === "tool" ? "output" : "function"}
    //           </div>
    //         </AccordionTrigger>
    //         <AccordionContent>
    //           {/* Uncomment this line and add RecursiveUI support if needed */}
    //           <RecursiveUI documentField={toJson(message.content)} />
    //           <div>{message.content}</div>
    //         </AccordionContent>
    //       </AccordionItem>
    //     </Accordion>
    //   </div>
    // );
  }

  return null;
};

// Utility function to parse JSON content safely
const toJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export default MessageContent;
