import { Router } from "express";
import {
	addPromptFlowData,
	addPromptFlowiseFlow,
	archiveOrchestrateFlowData,
	countToken,
	createOrchestrateChat,
	getFlowiseByFlowId,
	getFlowiseDataByflowId,
	getOrchestrateDataByVersion,
	getOrchestrateFlow,
	getOrchestrateVersion,
	runOrchestrateFlow,
	runPromptOrchestrateFlow,
	verifyFlowsAuthor,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";

const orchestrateRoutes: any = Router();

orchestrateRoutes.route("/projects/:projectId/authors/:userId/flows")
    .get( getOrchestrateFlow)
    .post( getOrchestrateVersion)
    .patch( archiveOrchestrateFlowData)

orchestrateRoutes.route("/flow")
    .post(userAuthentication, addPromptFlowData)

orchestrateRoutes.route("/run")
	.get( runOrchestrateFlow)
    .post( runPromptOrchestrateFlow)

orchestrateRoutes
	.route("/projects/:projectId/authors/:userId/flows/version/:version")
    .get( getOrchestrateDataByVersion)

orchestrateRoutes.route("/flowise/flows") // flowise axios api
    .post(addPromptFlowiseFlow)

orchestrateRoutes.route("/organization/:organizationId/projects/:projectId/flow")
    .get(getFlowiseByFlowId)

orchestrateRoutes.route("/organization/:organizationId/projects/:projectId/flowies/:flowiesId/authorIdentity")
	.get(userAuthentication, verifyFlowsAuthor)

orchestrateRoutes.route("/chatFlow/:flowId")
	.get(createOrchestrateChat)

orchestrateRoutes.route("/flowise/:flowId")
	// .get(getFlowiseDataByflowId)

orchestrateRoutes.route("/flows/:flowId/tokens")
	.post(countToken)

export default orchestrateRoutes;
