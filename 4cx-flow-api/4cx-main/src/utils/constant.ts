import { ChatCompletionSnapshot } from "openai/lib/ChatCompletionStream";
import { ChatCompletionMessage } from "openai/resources/chat/completions";

export const publicPath = 'public'

export const AI_NAME = "Azure Chat";
export const AI_DESCRIPTION = "Azure Chat is a friendly AI assistant.";
export const CHAT_DEFAULT_PERSONA = AI_NAME + " default";

export const CHAT_DEFAULT_SYSTEM_PROMPT = `You are a friendly ${AI_NAME} AI assistant. You must always return in markdown format.

You have access to the following functions:
1. create_img: You must only use the function create_img if the user asks you to create an image.`;

export const NEW_CHAT_NAME = "New chat";

export type AzureChatCompletionFunctionCall = {
    type: "functionCall";
    response: ChatCompletionMessage.FunctionCall;
  };
  
  export type AzureChatCompletionFunctionCallResult = {
    type: "functionCallResult";
    response: string;
  };
  
  export type AzureChatCompletionContent = {
    type: "content";
    response: ChatCompletionSnapshot;
  };
  
  export type AzureChatCompletionFinalContent = {
    type: "finalContent";
    response: string;
  };
  
  export type AzureChatCompletionError = {
    type: "error";
    response: string;
  };
  
  export type AzureChatCompletionAbort = {
    type: "abort";
    response: string;
  };
  
  export type AzureChatCompletion =
    | AzureChatCompletionError
    | AzureChatCompletionFunctionCall
    | AzureChatCompletionFunctionCallResult
    | AzureChatCompletionContent
    | AzureChatCompletionFinalContent
    | AzureChatCompletionAbort;
  