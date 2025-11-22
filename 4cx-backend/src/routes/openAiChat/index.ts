import { Router } from "express";
import {
	addExtensionToChatThread,
	createChatMessage,
	createChatThread,
	deleteAllChatThreads,
	findAllChatThreadForCurrentUser,
	findChatThreadForCurrentUser,
	findExtensionByID,
	findTopChatMessagesForCurrentUser,
	openAiChat,
	removeExtensionFromChatThread,
	softDeleteChatThreadForCurrentUser,
	updateChatTitle,
    updateExtension,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";

const openAIChatRoutes: any = Router();

openAIChatRoutes
	.route("/organizations/:organizationId/projects/:projectId/users/:userId/ai_chat")
	.get( findAllChatThreadForCurrentUser)
	.post( createChatThread)
	.delete(deleteAllChatThreads);

openAIChatRoutes
	.route("/organizations/:organizationId/projects/:projectId/users/:userId/thread/:threadId")
	.get( findChatThreadForCurrentUser)
	.patch( updateChatTitle)
	.delete( softDeleteChatThreadForCurrentUser);

openAIChatRoutes
	.route("/threads/:threadId/extension/:extensionId")
	.get( findExtensionByID)
    .post( addExtensionToChatThread)
    .put( updateExtension)
	.patch( removeExtensionFromChatThread)

openAIChatRoutes
	.route("/users/:userId/chatThreads/:threadId/message")
	.get( findTopChatMessagesForCurrentUser)
	.post( createChatMessage);

openAIChatRoutes
	.route("/")
	.post( openAiChat);


export default openAIChatRoutes;
