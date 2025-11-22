import { Router } from "express";
import {
	addPromptData,
	archivePrompt,
	clonePrompt,
	createPromptChat,
	editPrompt,
	getAllPrompts,
	getArchivePromptData,
	getAuthorLatestPromptDataNew,
	getPromptDataByVersion,
	// runPromptFlow,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";
 
const promptRoutes: any = Router();

promptRoutes
.route("/")
	.get(  getAllPrompts)
	.post( userAuthentication, addPromptData);

// promptRoutes.route("/prompts/:promptId/versions/:version")
promptRoutes
.route("/:promptId/version/:version")
	.get( getPromptDataByVersion)
	.post( createPromptChat)
	.put( editPrompt)
	.patch( archivePrompt);

promptRoutes
.route("/organizations/:organizationId/projects/:projectId/authors/:userId/prompt")
	.get( getAuthorLatestPromptDataNew);

promptRoutes
	.get("/archive", getArchivePromptData)
	.post("/clone", clonePrompt)
// .post("/run", runPromptFlow)

export default promptRoutes;
