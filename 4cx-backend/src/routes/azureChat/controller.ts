import { Types } from "mongoose";
import { Request, Response } from "express";

import { createErrorLog, createSuccessLog, countTokens, updateChatToken } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AzureChatModel, ChatThreadModel } from "../../core/data/models";


export const saveChat = async (req: AuthenticatedRequest, res: Response) => {
    const logService = "CHAT";
    const logType = "save_chat";
	try {
        let { projectId, chatData= {}, userId, orchestrateId, chatModel, organizationId, usageToken } = req.body;
        console.log(req.body);

        if( !projectId || !chatData || !userId || !orchestrateId) {
            return res.status(400).json({error: "Invalid input"})
        } 

        let role = chatData.type;
        let message = chatData.message;

        if( chatData.type == "user") {
            // let message = chatData.message;
            // let tokenCount = countTokens(message);
            await updateChatToken({
                userId: userId,
                projectId,
                organizationId,
                type : "orchestrate_chat",
                // token: tokenCount,
                usageToken
            });
        }

        await AzureChatModel.create({
            chat_history: chatData,
            role: role,
            content: message,
            orchestrate_id: orchestrateId,
            user_id: userId,
            project_id: projectId,
            ai_model: chatModel
        });

        res.status(200).json({ message: "Chat data save successfully."})
        await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
		});
        
	} catch (error: any) {
        console.log(error);
        await createErrorLog({
            service: logService,
            type: logType,
            message: `${error.message}`,
        });

        if(error.message === "Invalid input"){
            return res.status(400).json({error: error.message});
        }
        return res.status(500).json({ error: "Internal server error"})
    }
};
