import { Router } from "express";
import {
	archivePrompt,
	clonePrompt,
	createPrompt,
	createPromptChat,
	editPrompt,
	getAllPrompts,
	getArchivePromptData,
	getAuthorLatestPromptDataNew,
	getGetPromptCategory,
	getPromptData,
	getPromptDataByCategory,
	getPromptDataByVersion,
	runPromptFlow
} from "./controller";
import { userAuthentication } from "../../middleware/auth";
 
const promptRoutes: any = Router();

promptRoutes.route("/")
	.get(getAllPrompts)
	.post(userAuthentication, createPrompt);

// promptRoutes.route("/prompts/:promptId/versions/:version")
promptRoutes.route("/:promptId/version/:version")
	.get( getPromptDataByVersion)
	.post( createPromptChat)
	.put( editPrompt)
	.patch( archivePrompt);

promptRoutes.route("/:promptId/category")
	.get(getPromptDataByCategory)

promptRoutes.route("/organizations/:organizationId/projects/:projectId/authors/:userId/prompt")
	.get( getAuthorLatestPromptDataNew);

promptRoutes
	.get("/archive", getArchivePromptData)
	.post("/clone", clonePrompt)
	.post("/run", runPromptFlow)

promptRoutes.get("/organizations/:organizationId/project/:projectId/flow-prompt", getPromptData)

promptRoutes.get("/organizations/:organizationId/project/:projectId/authors/:userId/promptCategory", getGetPromptCategory)

export default promptRoutes;
