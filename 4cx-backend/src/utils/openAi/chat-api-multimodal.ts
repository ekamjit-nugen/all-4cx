import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { OpenAIVisionInstance } from "./openAiService";
import { IOpenAiChatThread } from "../../core/data/IOpenAiChatThread";

export const ChatApiMultimodal = (props: {
	chatThread: IOpenAiChatThread;
	userMessage: string;
	file: string;
	model: string;
	temperature: number;
	topP: number;
	frequencyPenalty: number;
	presencePenalty: number;
}): ChatCompletionStreamingRunner => {
	const {
		chatThread,
		userMessage,
		file,
		model,
		temperature,
		topP,
		frequencyPenalty,
		presencePenalty,
	} = props;

	const openAI = OpenAIVisionInstance();

	return openAI.beta.chat.completions.stream({
		model: model,
		max_tokens: 4096,
		messages: [
			{
				role: "system",
				content:
					chatThread.persona_message +
					"\n You are an expert in extracting insights from images that are uploaded to the chat. \n You will answer questions about the image that is provided.",
			},
			{
				role: "user",
				content: [
					{ type: "text", text: userMessage },
					{
						type: "image_url",
						image_url: {
							url: file,
						},
					},
				],
			},
		],
		temperature: temperature,
		top_p: topP,
		// max_tokens: 800,
		// "Frequency_Penalty": presencePenalty,
		// "Presence_Penalty" : frequencyPenalty
	});
};
