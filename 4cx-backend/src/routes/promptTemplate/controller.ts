import { Request, Response } from "express";
import { PromptModel, PromptTemplateModel } from "../../core/data/models";
import PromptVersion from "../../core/data/models/promptVersion";
import { compareSecretKey, createSuccessLog, createErrorLog } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";

export const createPromptTemplate = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT_TEMPLATE";
	const logType = "create_prompt_tenant";

	// let { clerk_id } = req.userInfo;
	let authKey = req.headers["security_key"];
	if (!authKey) {
		// return res.status(400).json({
		// 	error: "security_key is required to perform this action",
		// });
		throw new Error("security_key is required to perform this action");
	}
	let secretKeyCheck = compareSecretKey(authKey);

	if (!secretKeyCheck) {
		// return res.status(401).json({ error: "security_key is not valid" });
		throw new Error("security_key is not valid");
	}
	let { promptTemplate } = req.body;
	if (!promptTemplate) {
		// return res
		// 	.status(400)
		// 	.json({ error: "Invalid input in promptTemplate json" });
		throw new Error("Invalid input in promptTemplate json");
	}
	let {
		title,
		organizationId,
		userId,
		projectId,
		inputMedia,
		category,
		task,
		systemMessage,
		inputPrompt,
		sampleResponse,
	} = promptTemplate;

	if (
		!title ||
		!userId ||
		!projectId ||
		!organizationId ||
		!category ||
		!task ||
		!systemMessage ||
		!inputPrompt ||
		!sampleResponse
	) {
		// return res.status(400).json({ error: "Invalid input" });
		throw new Error("Invalid input");
	}
	try {
		await PromptTemplateModel.create({
			title,
			organization_id: organizationId,
			user_id: userId,
			project_id: projectId,
			category,
			task,
			input_media: inputMedia,
			system_message: systemMessage,
			input_prompt: inputPrompt,
			sample_response: sampleResponse,
		});

		res.status(200).json({
			message: "Prompt template is created successfully",
		});

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
		if(error.message == "security_key is required to perform this action"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "security_key is not valid"){
			return res.status(401).json({error: error.message});
		}
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getPromptTemplate = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT_TEMPLATE";
	const logType = "get_prompt_tenant";

	// let { clerk_id } = req.userInfo;
	let { organizationId, projectId } = req.params;
	try {

		let promptTemplate = await PromptTemplateModel.find({
			project_id: projectId,
			organization_id: organizationId,
		});

		res.status(200).json({ data: promptTemplate || [] });
		await createSuccessLog({
			// userId: clerk_id,
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

export const clonePromptTemplate = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT_TEMPLATE";
	const logType = "clone_prompt_tenant";

	// let { clerk_id } = req.userInfo;
    let { organizationId, projectId } = req.params;
    let { promptTemplateId, userId } = req.body;

	try {
		if (!promptTemplateId || !userId) {
			// return res
			// 	.status(400)
			// 	.json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}

		let templateInfo = await PromptTemplateModel.findOne({
			_id: promptTemplateId,
			organization_id: organizationId,
			project_id: projectId,
			is_active: true,
			is_deleted: false,
		});

		if (!templateInfo) {
			// return res.status(404).json({ error: "Template data not found" });
			throw new Error("Template data not found");
		}

		let promptInfo = await PromptModel.create({
			organization_id: organizationId,
			project_id: projectId,
			prompt_type: "PROJECT",
			version_count: 1,
			isCloned: true,
			author: userId,
		});

		await PromptVersion.create({
			prompt_id: promptInfo._id,
			prompt_title: templateInfo.title,
			prompt_text: templateInfo.system_message,
			category: "Prompt_Template",
		});

		res.status(200).json({ message: "Prompt Template cloned successfully" });

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
		if(error.message == "Invalid input"){
    		return res.status(400).json({error: error.message});
		}
		if(error.message == "Template data not found"){
    		return res.status(404).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
