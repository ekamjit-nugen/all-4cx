import { AI_NAME,  AzureChatCompletion, AzureChatCompletionAbort } from "../constant";
import { IOpenAiChatThread } from "../../core/data/IOpenAiChatThread";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { CreateChatMessage, createSuccessLog, createErrorLog, updateChatToken, usageToken } from "../../utils/commonhelper";
import { TenantModel } from "../../core/data/models";

export const OpenAIStream = (props: {
  organizationId: string,
  projectId: Object,
  tokenCount: number,
  logService: string,
  threadId: Object,
  userId: string,
  runner: ChatCompletionStreamingRunner;
  chatThread: IOpenAiChatThread;
  message: string;
}) => {
  const encoder = new TextEncoder();

  const { organizationId, projectId, logService, threadId, userId, runner, chatThread, message } = props;

  const readableStream = new ReadableStream({
    async start(controller) {
      const streamResponse = (event: string, value: string) => {
        controller.enqueue(encoder.encode(`event: ${event} \n`));
        controller.enqueue(encoder.encode(`data: ${value} \n\n`));
      };

      let lastMessage = "";

      runner
        .on("content", (content) => {
          const completion = runner.currentChatCompletionSnapshot;

          if (completion) {
            const response: AzureChatCompletion = {
              type: "content",
              response: completion,
            };
            lastMessage = completion.choices[0].message.content ?? "";
            streamResponse(response.type, JSON.stringify(response));
          }
        })
        .on("functionCall", async (functionCall) => {
          await CreateChatMessage({
            name: functionCall.name,
            content: functionCall.arguments,
            role: "function",
            chatThreadId: chatThread._id,
          });

          const response: AzureChatCompletion = {
            type: "functionCall",
            response: functionCall,
          };
          streamResponse(response.type, JSON.stringify(response));
        })
        .on("functionCallResult", async (functionCallResult) => {
          const response: AzureChatCompletion = {
            type: "functionCallResult",
            response: functionCallResult,
          };
          await CreateChatMessage({
            name: "tool",
            content: functionCallResult,
            role: "function",
            chatThreadId: chatThread._id,
          });
          streamResponse(response.type, JSON.stringify(response));
        })
        .on("abort", (error) => {
          const response: AzureChatCompletionAbort = {
            type: "abort",
            response: "Chat aborted",
          };
          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        })
        .on("error", async (error) => {
          console.log("🔴 error", error);
          const response: AzureChatCompletion = {
            type: "error",
            response: error.message,
          };

          // if there is an error still save the last message even though it is not complete
          await CreateChatMessage({
            name: AI_NAME,
            content: lastMessage,
            role: "assistant",
            chatThreadId: props.chatThread._id,
          });

          streamResponse(response.type, JSON.stringify(response));
          await createErrorLog({
            userId: userId,
            service: logService,
            threadId,
            type: "assistant",
            message: JSON.stringify(response),
          });
          controller.close();
        })
        .on("finalContent", async (content: string) => {
          await CreateChatMessage({
            name: AI_NAME,
            content: content,
            role: "assistant",
            chatThreadId: props.chatThread._id,
          });

          const response: AzureChatCompletion = {
            type: "finalContent",
            response: content,
          };
          streamResponse(response.type, JSON.stringify(response));

          // await TenantModel.updateOne(
          //   {
          //     clerk_id: userId,
          //   },
          //   {
          //     $set: {
          //       token_usage :{
          //         prompt_tokens: + tokenCount,
          //       }
          //     }
          //   }
          // );          

          await createSuccessLog({
            userId: userId,
            service: logService,
            threadId: threadId,
            type : "assistant",
            message: JSON.stringify(response),
            // token: tokenCount
          });
          let outputMessage = JSON.stringify(response);
          let token = await usageToken({ input: message,  output: outputMessage})
          await updateChatToken({
            userId: userId,
            projectId,
            organizationId,
            threadId: threadId,
            type : "azure_open_ai",
            usageToken: token,
          });

          controller.close();
        });
    },
  });

  return readableStream;
};