import { OpenAIInstance } from "./openAiService";
// import { FindExtensionByID } from "";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { IOpenAiChatThread } from "../../core/data/IOpenAiChatThread";

export const ChatApiExtensions = async (props: {
	chatThread: IOpenAiChatThread;
	userMessage: string;
	history: ChatCompletionMessageParam[];
	extensions: RunnableToolFunction<any>[];
	model: string;
	temperature: number;
	topP: number;
	frequencyPenalty: number;
	presencePenalty: number;
}): Promise<ChatCompletionStreamingRunner> => {
	const {
		userMessage,
		history,
		chatThread,
		extensions,
		model,
		temperature,
		topP,
		frequencyPenalty,
		presencePenalty,
	} = props;

	const openAI = OpenAIInstance();
	const systemMessage = await extensionsSystemMessage(chatThread);
	if (chatThread.persona_message) {
		return openAI.beta.chat.completions.runTools({
			model: model,
			stream: true,
			stream_options: {
				include_usage: true,
			},
			messages: [
				{
					role: "system",
					content: chatThread.persona_message,
				},
				...history,
				{
					role: "user",
					content: userMessage,
				},
			],
			tools: extensions,
			temperature: temperature,
			top_p: topP,
			max_tokens: 800,
			// "Frequency_Penalty": presencePenalty,
			// "Presence_Penalty" : frequencyPenalty
		});
	}
	return openAI.beta.chat.completions.runTools({
		model: model,
		stream: true,
		stream_options: {
			include_usage: true,
		},
		messages: [
			{
				role: "system",
				content: chatThread.persona_message + "\n" + systemMessage,
			},
			...history,
			{
				role: "user",
				content: userMessage,
			},
		],
		tools: extensions,
		temperature: temperature,
		top_p: topP,
		max_tokens: 800,
		// "Frequency_Penalty": presencePenalty,
		// "Presence_Penalty" : frequencyPenalty
	});
};

const extensionsSystemMessage = async (chatThread: IOpenAiChatThread) => {
	let message = "";

	// for (const e of chatThread.extension) {
	//   const extension = await FindExtensionByID(e);
	//   if (extension.status === "OK") {
	//     message += ` ${extension.response.executionSteps} \n`;
	//   }
	// }

	return message;
};
