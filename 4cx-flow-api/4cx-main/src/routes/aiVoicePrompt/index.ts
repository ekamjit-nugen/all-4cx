import { Router } from "express";
import { archivePromptData, clonePrompt, getAiVoicePrompt, getOrchestrateDataByVersion, saveAiVoicePrompt  } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const aiVoiceRouter: any = Router()

aiVoiceRouter.route("/organizations/:organizationId/projects/:projectId/aiVoice")
    .get( userAuthentication, getAiVoicePrompt)    
    .post( userAuthentication, saveAiVoicePrompt)
    .patch( userAuthentication, clonePrompt)

aiVoiceRouter.route("/prompt/:promptId/version/:version")
    .get( userAuthentication, getOrchestrateDataByVersion)
    .patch( userAuthentication, archivePromptData)

export default aiVoiceRouter; 