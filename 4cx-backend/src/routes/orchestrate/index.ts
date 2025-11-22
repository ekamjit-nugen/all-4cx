import { Router } from "express";
import {
	addPromptFlowData,
	archiveOrchestrateFlowData,
	getOrchestrateDataByVersion,
	getOrchestrateFlow,
	getOrchestrateVersion,
	runOrchestrateFlow,
	runPromptOrchestrateFlow,
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

export default orchestrateRoutes;
