// import { ServerActionResponse } from "@/features/common/server-action-response";
import { OpenAIDALLEInstance } from "./openAiService";
// import { uniqueId } from "@/features/common/util";
import { GetImageUrl, UploadImageToStore } from "./chat-image-service";
import { IOpenAiChatThread } from "../../core/data/IOpenAiChatThread";
import { uniqueId } from "../commonhelper";

export const GetDefaultExtensions = async (props: {
  chatThread: IOpenAiChatThread;
  userMessage: string;
  // signal: AbortSignal;
}) => {
  const defaultExtensions: Array<any> = [];

  // Add image creation Extension
  defaultExtensions.push({
    type: "function",
    function: {
      function: async (args: any) =>
        await executeCreateImage(
          args,
          props.chatThread._id,
          props.userMessage,
          // props.signal
        ),
      parse: (input: string) => JSON.parse(input),
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string" },
        },
      },
      description:
        "You must only use this tool if the user asks you to create an image. You must only use this tool once per message.",
      name: "create_img",
    },
  });

  // Add any other default Extension here

  return {
    status: "OK",
    response: defaultExtensions,
  };
};

// Extension for image creation using DALL-E
async function executeCreateImage(
  args: { prompt: string },
  threadId: Object,
  userMessage: string,
) {
  console.log("createImage called with prompt:", args.prompt);

  if (!args.prompt) {
    return "No prompt provided";
  }

  // Check the prompt is < 4000 characters (DALL-E 3)
  if (args.prompt.length >= 4000) {
    return "Prompt is too long, it must be less than 4000 characters";
  }

  // const openAI = OpenAIDALLEInstance();

  let response;

  try {
    const url ="https://thinkg-aidalle-qarwmensv7n5g.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-05-01-preview";

    const fetchResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "51cd08ab46054256925db609570ac1a9"
      },
      body: JSON.stringify({
        prompt: userMessage,
        "size": "1024x1024",
        "n": 1,
        "style": "vivid",
        "quality": "standard",
        "response_format": "b64_json"
      }),
       // Abort signal for request cancellation
    });

    if (!fetchResponse.ok) {
      throw new Error(`API responded with status: ${fetchResponse.status}`);
    }

    // Parse JSON response and explicitly cast it to `ImageGenerationResponse`
    response = (await fetchResponse.json());
    console.log(response);

  } catch (error: any) {
    console.error("🔴 error:\n", error);
    return {
      error: `There was an error creating the image: ${error.message}. Return this message to the user and halt execution.`,
    };
  }

  // Validate the response
  if (!response?.data?.[0]?.b64_json) {
    return {
      error: "There was an error creating the image: Invalid API response received. Return this message to the user and halt execution.",
    };
  }
  // if (!response?.data?.[0]?.url) {
  //   return {
  //     error: "There was an error creating the image: Invalid API response received. Return this message to the user and halt execution.",
  //   };
  // }

  // Upload image to blob storage
  const imageName = `${uniqueId()}.png`;

  try {
    await UploadImageToStore(
      threadId,
      imageName,
      Buffer.from(response.data[0].b64_json, "base64")
    );

    const updatedResponse = {
      revised_prompt: response.data[0].revised_prompt,
      url: GetImageUrl(threadId, imageName),
    };
    return updatedResponse;
  } catch (error: any) {
    console.error("🔴 error:\n", error);
    return {
      error: `There was an error storing the image: ${error.message}. Return this message to the user and halt execution.`,
    };
  }
}
