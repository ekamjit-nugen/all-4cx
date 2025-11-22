import React, { useRef } from "react";
import { ResetInputRows, onKeyDown, onKeyUp } from "./ChatInputDynamicHeight";
import {
  ChatInputActionArea,
  ChatInputForm,
  ChatInputPrimaryActionArea,
  ChatInputSecondaryActionArea,
} from "../../chatInputOptions/ChatInputArea";
import { ChatTextInput } from "../../chatInputOptions/ChatTextInput";
import { SubmitChat } from "../../chatInputOptions/SubmitChat";
import { ImageInput } from "../../chatInputOptions/ChatImageInput"; // Importing ImageInput
import { useSelector } from "react-redux";

export const ChatInput = ({ onSendMessage, responseLoading }) => {
  const azureRoute = useSelector((state)=>state.azureChatRoutes.currentChatRoute)
  const submitButtonRef = useRef(null);
  const formRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    // Ensure e is an event object
    if (e && e.preventDefault) {
      e.preventDefault();

      if (formRef.current) {
        const inputValue = formRef.current.elements.chatInput.value.trim();
        if (inputValue) {
          onSendMessage(inputValue);
          formRef.current.reset(); // Reset input after sending message
          ResetInputRows(); // Reset textarea rows
        }
      }
    } else {
      console.error("Invalid event object:", e);
    }
  };

  return (
    <ChatInputForm ref={formRef} onSubmit={handleSubmit}>
      <div className="flex flex-1 gap-2 items-center text-base">
        {/* Text input for chat */}
        <ChatTextInput
          name="chatInput"
          onBlur={(e) => {
            if (e.currentTarget.value.trim().length === 0) {
              ResetInputRows();
            }
          }}
          onKeyDown={(e) => onKeyDown(e, handleSubmit)} // Trigger submit on key down (Enter)
          onKeyUp={onKeyUp}
          rows={1}
        />
        <ChatInputActionArea>
          <ChatInputSecondaryActionArea>
            {/* Placeholder for any secondary actions */}
          </ChatInputSecondaryActionArea>
          <ChatInputPrimaryActionArea>
            {/* Image Input component */}
            {azureRoute === 2 && <ImageInput responseLoading={responseLoading} />}
            {/* Submit button */}
            <SubmitChat ref={submitButtonRef} responseLoading={responseLoading} />
          </ChatInputPrimaryActionArea>
        </ChatInputActionArea>
      </div>
    </ChatInputForm>
  );
};
