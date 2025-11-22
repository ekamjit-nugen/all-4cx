import { Request, Response } from "express";
import {
	ChatExtentionModel,
	ChatModel,
	ChatThreadModel,
} from "../../core/data/models";
import { Types } from "mongoose";

import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { CHAT_DEFAULT_SYSTEM_PROMPT } from "../../utils/constant";
import { OpenAIStream } from "../../utils/openAi/openAiStream";
import {
	CreateChatMessage,
	createSuccessLog,
	createErrorLog,
	getHistory,
	countTokens,
} from "../../utils/commonhelper";
import { ChatApiExtensions } from "../../utils/openAi/openAiChat";
import { getExtensions } from "../../utils/commonhelper";
import { ChatApiMultimodal } from "../../utils/openAi/chat-api-multimodal";
import { AuthenticatedRequest } from "../../middleware/auth";

type ChatTypes = "extensions" | "chat-with-file" | "multimodal";

export const createChatThread = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "create_chat_thread";

	// let { clerk_id } = req.userInfo;
	let { projectId, organizationId, userId } = req.params;

	if (!projectId || !organizationId || !userId) {
		return res.status(400).json({ error: "Invalid input" });
	}
	try {
		if( !projectId || !organizationId || !userId) {
			// return res.status(400).json({error: "Invalid input"});
			throw new Error("Invalid input");
		}
		let {
			name = "New Chat",
			personaMessage,
			personaMessageTitle,
			type = "CHAT_THREAD",
			model = "gpt4o",
			temperature = 0.7,
			topP = 0.95,
			frequencyPenalty = 0 ,
			presencePenalty = 0,
		} = req.body;

		let chatThreadInfo = await ChatThreadModel.create({
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
			name: name,
			type,
			model,
			temperature,
			topP,
			frequencyPenalty,
			presencePenalty,
		});
		res.status(200).json({
			message: "New chat session is created",
			data: chatThreadInfo,
		});

		await createSuccessLog({
			userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({ error: "Invalid input" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const findAllChatThreadForCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "find_chat_thread_user";

	// let { clerk_id } = req.userInfo;
	let { organizationId, projectId, userId } = req.params;

	try {
		let pipeline: any = [
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					type: "CHAT_THREAD",
					user_id: userId,
					is_deleted: false,
				},
			},
			{
				$sort: {
					// createdAt: -1,
					updatedAt: -1,
				},
			},
		];

		const chatThread = await ChatThreadModel.aggregate(pipeline);
		res.status(200).json({ data: chatThread || [] });
		await createSuccessLog({
			userId: userId,
			organizationId,
			projectId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			organizationId,
			projectId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteAllChatThreads = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "delete_chat_thread";

	let { organizationId, projectId, userId } = req.params;
	try {
		await ChatThreadModel.updateMany(
			{
				is_deleted: false,
				organization_id: organizationId,
				project_id: projectId,
				userId: userId,
			},
			{
				$set: {
					is_deleted: true,
				},
			}
		);
		res.status(200).json({ message: "Chat thread data is cleared" });

		await createSuccessLog({
			userId: userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			userId: userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error." });
	}
};

export const findChatThreadForCurrentUser = async ( req: AuthenticatedRequest, res: Response ) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "find_chat_thread_current_user";
	// let { clerk_id } = req.userInfo;
	const { organizationId, projectId, userId, threadId } = req.params;

	try {
		let pipeline: any = [
			{
				$match: {
					_id: new Types.ObjectId(threadId),
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					user_id: userId,
					is_deleted: false,
				},
			},
			{
				$lookup: {
					from: "open_ai",
					pipeline: [
						{
							$project: {
								_id: 1,
								role: 1,
								content: 1,
								multi_modal_image: 1,
							},
						},
					],
					localField: "_id",
					foreignField: "thread_id",
					as: "chat_history",
				},
			},
			{
				$addFields: {
					chat_history: { $ifNull: ["$chat_history", []] },
				},
			},
			{
				$addFields: {
					is_chat_history_empty: {
						$eq: [{ $size: "$chat_history" }, 0],
					},
				},
			},
			{
				$unwind: {
					path: "$chat_history",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: "$_id",
					organization_id: { $first: "$organization_id" },
					project_id: { $first: "$project_id" },
					name: { $first: "$name" },
					persona_message: { $first: "$persona_message" },
					persona_message_title: { $first: "$persona_message_title" },
					user_id: { $first: "$user_id" },
					bookmarked: { $first: "$bookmarked" },
					extension: { $first: "[]" },
					type: { $first: "$type" },
					is_deleted: { $first: "$is_deleted" },
					is_active: { $first: "$is_active" },
					// checking if the chat is empty then insert a default chat instance
					chat_history: {
						$push: {
							$cond: {
								if: "$is_chat_history_empty",
								then: {
									_id: new Types.ObjectId(),
									role: "assistant",
									content: "Hello! How can I help you?",
								},
								else: "$chat_history",
							},
						},
					},
					createdAt: { $first: "$createdAt" },
					updatedAt: { $first: "$updatedAt" },
				},
			},
		];
		const chatThread = await ChatThreadModel.aggregate(pipeline);
		res.status(200).json({ data: chatThread[0] || {} });

		await createSuccessLog({
			userId: userId,
			threadId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			threadId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const updateChatTitle = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "update_chat_title";

	// let { clerk_id } = req.userInfo;
	let { threadId, userId } = req.params;
	let { title } = req.body;

	try {
		let checkChatThreadInfo = await ChatThreadModel.findOne({
			_id: threadId,
			user_id: userId,
			is_deleted: false,
		});

		if (!checkChatThreadInfo) {
			// return res.status(400).json({ error: "Chat thread data not found" });
			throw new Error("Chat thread data not found");
		}
		await ChatThreadModel.updateOne(
			{
				_id: threadId,
			},
			{
				name: title,
			}
		);
		res.status(200).json({ message: "Chat title is updated successfully" });

		await createSuccessLog({
			userId: userId,
			threadId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		await createErrorLog({
			// userId: clerk_id,
			threadId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({ error: error.message });
		}
		if(error.message == "Chat thread data not found"){
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const softDeleteChatThreadForCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "create_prompt_tenant";

	// let { clerk_id } = req.userInfo;
	let { threadId, userId } = req.params;

	try {
		const chatThreadInfo = await ChatThreadModel.findOne({
			_id: threadId,
			user_id: userId,
		});

		if (!chatThreadInfo) {
			// return res.status(400).json({ error: "Chat data not found" });
			throw new Error("Chat data not found")
		}
		let isDeleted = !chatThreadInfo.is_deleted;

		await ChatThreadModel.updateOne(
			{ _id: threadId },
			{ $set: { is_deleted: isDeleted } }
		);

		res.status(200).json({
			message: "Chat thread data updated successfully",
		});
		await createSuccessLog({
			userId: userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if( error.message == "Chat data not found"){
			return res.status(404).json({ error: error.message });
		}

		return res.status(500).json({ error: "Internal server error" });
	}
};

export const addExtensionToChatThread = async (req: AuthenticatedRequest, res: Response) => {
	const { chatThreadId, extensionId } = req.params;

	try {
		const chatThreadResponse = await ChatThreadModel.findOne({
			_id: chatThreadId,
			extension: extensionId,
		});
		if (!chatThreadResponse) {
			return res.status(400).json({ error: "Invalid data." });
		}

		const existingExtension = chatThreadResponse.extension.find(
			(e) => e === extensionId
		);

		if (!existingExtension) {
			return res
				.status(404)
				.json({ error: "Chat extension data is not found" });
		}

		const chatDocumentsResponse = await ChatModel.findOne({
			thread_id: chatThreadId,
		});

		return res.status(200).json({
			status: "OK",
			response: chatThreadResponse,
		});
	} catch (error) {
		return res.status(500).json({
			status: "ERROR",
			errors: [{ message: `${error}` }],
		});
	}
};

export const findExtensionByID = async (req: AuthenticatedRequest, res: Response) => {
	try {
		let { extentionId } = req.params;

		let chatExtentionInfo = await ChatExtentionModel.findOne({
			_id: extentionId,
			is_deleted: false,
			is_active: true,
		});

		res.status(200).json({ data: chatExtentionInfo });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ errors: "Internal server error." });
	}
};

export const updateExtension = async (req: AuthenticatedRequest, res: Response) => {
	try{
		let { extentionId } = req.params;

		let upadateExtension = await ChatExtentionModel.updateOne(
			{
				_id: extentionId,
			},
			{}
		);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ errors: "Internal server error." });
	}
};

export const removeExtensionFromChatThread = async (req: AuthenticatedRequest, res: Response) => {
	const { chatThreadId, extensionId } = req.params;

	try {
		const chatThreadResponse = await ChatThreadModel.findOne({
			_id: chatThreadId,
			extension: extensionId,
		});
		if (!chatThreadResponse) {
			return res.status(400).json({ error: "Invalid input" });
		}

		await ChatThreadModel.updateOne(
			{ _id: chatThreadId },
			{
				$set: {
					extension: [],
				},
			}
		);
		return res
			.status(200)
			.json({ message: "Chat thread data updated successfully" });
	} catch (error) {
		return res.status(500).json({
			status: "ERROR",
			errors: [{ message: `${error}` }],
		});
	}
};

export const createChatMessage = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "create_chat_message";
	
	// let { clerk_id } = req.userInfo;
	let { threadId, userId } = req.params;
	try{

		let { name, content, role, multiModalImage} = req.body;
		if( !name || !content || !role) {
			// return res.status(400).json({error: "Invalid Input"});
			throw new Error("Invalid input");
		};
		await ChatModel.create({
			user_id: userId,
			name: name,
			content: content,
			role: role,
			thread_id: threadId,
			multi_modal_image: multiModalImage,
		});
		res.status(200).json({
			message: "Chat message data saved successfully",
		});
		await createSuccessLog({
			userId: userId,
			threadId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({error: "Internal server error"})
	}
};

export const findTopChatMessagesForCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "find_top_chat_messages_for_user";

	// let { clerk_id } = req.userInfo;
	let { threadId, userId} = req.params;
	try{
		let pipeline: any= [];
	
		let chatThreadInfo = await ChatThreadModel.findOne({
			_id: threadId,
			user_id: userId,
		});

		if (!chatThreadInfo){
			// return res.status(400).json({error: "chat thread data not found."})
			throw new Error("Chat thread data not found");
		}

		pipeline = [
			{
				$match: {
					thread_id: new Types.ObjectId(chatThreadInfo._id),
					is_deleted: false,
				},
			},
			{
				$sort: {
					createdAt: 1,
				},
			},
		];
		let chatInfo = await ChatModel.aggregate(pipeline);
		res.status(200).json({ data: chatInfo || [] });

		await createSuccessLog({
			userId: userId,
			threadId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			threadId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Chat thread data not found"){
			return res.status(404).json({error: error.message});
		}
		return res.status(500).json({error: "Internal server error"})
	}
};

export const findAllChatMessagesForCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "find_all_chat_messages_user";

	// let { clerk_id } = req.userInfo;
	let { threadId, userId } = req.params;
	try {
		let pipeline: any = [];
		pipeline = [
			{
				$match: {
					user_id: userId,
					thread_id: threadId,
					is_deleted: false,
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
		];
		const chatInfo = await ChatModel.aggregate(pipeline);
		res.status(200).json({ data: chatInfo });

		await createSuccessLog({
			userId: userId,
			threadId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			service: logService,
			threadId,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const openAiChat = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "CHAT_OPEN_AI";
	const logType = "chat";

	// let { clerk_id } = req.userInfo;

	let {
		userId,
		threadId,
		message,
		multimodalImage,
		organizationId,
		projectId,
	} = req.body;

	if (!userId || !threadId || !message) {
		// return res.status(400).json({ error: "Invalid input" });
		throw new Error("Invalid input");
	}
	try {
		let tokenCount = countTokens(message);
		// console.log(`<<<<<<< tokenCount: ${tokenCount} >>>>>>>>>`);

		let chatThreadInfo = await ChatThreadModel.findOne({
			_id: threadId,
			is_deleted: false,
		});

		if( !chatThreadInfo) {
			// return res.status(404).json({error: "Chat data not found"});
			throw new Error("Chat data not found");
		};

		await CreateChatMessage({
			userId: chatThreadInfo.user_id,
			name: chatThreadInfo.name, // user-name
			content: message,
			role: "user",
			chatThreadId: threadId,
			multiModalImage: multimodalImage,
		});

		await createSuccessLog({
			userId,
			service: logService,
			type: "user",
			threadId,
			message: message,
		});

		let currentChatThread: any = chatThreadInfo;

		const [history, extension] = await Promise.all([
			getHistory({
				threadId,
			}),
			getExtensions({
				chatThread: currentChatThread,
				userMessage: message,
			}),
		]);

		let chatType: ChatTypes = "extensions";

		if (multimodalImage && multimodalImage.length > 0) {
			chatType = "multimodal";
		}

		if (currentChatThread.persona_message) {
			currentChatThread.persona_message = `${currentChatThread.persona_message}`;
		} else {
			currentChatThread.persona_message = `${CHAT_DEFAULT_SYSTEM_PROMPT}`;
		}

		let runner: ChatCompletionStreamingRunner | any;

		switch (chatType) {
			case "extensions":
				runner = await ChatApiExtensions({
					chatThread: currentChatThread,
					userMessage: message,
					history: history || [],
					extensions: extension,
					model: chatThreadInfo.model,
					temperature: chatThreadInfo.temperature,
					topP: chatThreadInfo.topP,
					frequencyPenalty: chatThreadInfo.frequencyPenalty,
					presencePenalty: chatThreadInfo.presencePenalty,
				});
				break;
			case "multimodal":
				runner = ChatApiMultimodal({
					chatThread: currentChatThread,
					userMessage: message,
					file: multimodalImage,
					model: chatThreadInfo.model,
					temperature: chatThreadInfo.temperature,
					topP: chatThreadInfo.topP,
					frequencyPenalty: chatThreadInfo.frequencyPenalty,
					presencePenalty: chatThreadInfo.presencePenalty,
				});
				break;
		}

		const chatResponseData = OpenAIStream({
			organizationId,
			projectId,
			tokenCount,
			logService,
			threadId,
			userId: userId,
			runner: runner,
			chatThread: currentChatThread,
			message: message,
		});

		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders(); // Flush the headers to establish the connection

		// Pipe the stream to the response
		chatResponseData.pipeTo(
			new WritableStream({
				write(chunk) {
					if (chunk.usage) {
						// console.log("Chunk***");
					}
					res.write(chunk); // Write each chunk to the response
				},
				close() {
					res.end(); // End the response when the stream is done
				},
				abort(err) {
					console.error("Stream aborted", err);
					res.status(500).end("Stream aborted");
				},
			})
		);
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			threadId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Chat data not found"){
			return res.status(404).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error"});
	}
};
