import { Types } from "mongoose";
import { Request, Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth";
import { createErrorLog, createNotificationLog, createSuccessLog } from "../../utils/commonhelper";
import { AiVoiceModel, PromptModel } from "../../core/data/models";

export const saveAiVoicePrompt = async (req: AuthenticatedRequest, res: Response) => {
	const event = "notification";
    const logService = "AI VOICE PROMPT";
	const logType = "save AI Voice Prompt";
    try{
        const {organizationId, projectId } = req.params;
        const { clerk_id: userId } = req.userInfo;

        const { 
			promptId,
            promptName,
            promptCategory,
            promptText,
            introPrompt,
            businessLogicType,
            closurePrompt,
            isOrganization = false,
            flowiseId,
			flowisePage,
			isUpdated = false,
			version
        } =req.body;

		let prompt= {};

		if (!isUpdated) {

			if(!organizationId || !projectId || !promptName || !promptCategory || !introPrompt || !businessLogicType || !closurePrompt) {
				throw new Error("Invalid input");
			}

			const query: any = {
				organization_id: organizationId,
				author: userId,
				prompt_type: isOrganization ? "ORGANIZATION" : "PROJECT",
				aiVoicePrompt: true,
			};
			
			if (!isOrganization) {
				query.project_id = projectId;
			}
			
			const promptData = await PromptModel.create(query);
			const promptId = promptData._id;

			let promptQuery = {
				prompt_id: promptId,
				prompt_title: promptName,
				category: promptCategory,
				prompt_text: businessLogicType == "PROMPT" ? promptText : null,
				intro_prompt: introPrompt,
				business_logic_type: businessLogicType,
				closure_prompt: closurePrompt,
				is_organization: isOrganization,
				flowise_id: businessLogicType == "FLOW" ? flowiseId : null,
				flowise_page: flowisePage
			}
	
			prompt = await AiVoiceModel.create(promptQuery);
		}else {

			const pipeline = [
				{
					$match: {
						prompt_id: new Types.ObjectId(promptId),
					}
				},
				{
					$lookup: {
						from: "prompts",
						localField: "prompt_id",
						foreignField: "_id",
						as: "result"
					}
				},
				{
					$unwind: {
						path: "$result",
						preserveNullAndEmptyArrays: false,
					}
				},
				{
					$match: {
						"result.project_id": new Types.ObjectId(projectId),
						"result.organization_id": organizationId,
					}
				}
			];
			// console.log(JSON.stringify(pipeline));
			const promptInfo = await AiVoiceModel.aggregate(pipeline);

			if (promptInfo.length == 0 ) {
				throw new Error("Prompt not found");
			}

			if ( !organizationId || !promptName || !projectId || !promptCategory) {
				// return res.status(400).json({ error: "Invalid input" });
				throw new Error("Invalid input");
			}

			let autoIncrementVersion = promptInfo.length;
			autoIncrementVersion++;

			let promptQuery = {
				prompt_id: promptInfo[0].prompt_id,
				prompt_title: promptInfo[0].prompt_title,
				prompt_text: businessLogicType == "PROMPT" ? promptText : null,
				category: promptInfo[0].category,
				intro_prompt: introPrompt,
				business_logic_type: businessLogicType,
				closure_prompt: closurePrompt,
				is_organization: promptInfo[0].is_organization,
				flowise_id: businessLogicType == "FLOW" ? flowiseId : null,
				flowise_page:  businessLogicType == "FLOW" ? flowisePage : null,
				version: autoIncrementVersion,
			}
			prompt = await AiVoiceModel.create(promptQuery);

			await PromptModel.findOneAndUpdate(
				{
					_id: promptId,
				},
				{
					version_count: autoIncrementVersion,
				}
			);
		}

    	res.status(200).json({message: 'Prompt saved successfully', data: prompt});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed",
		});

		// createSuccessLog({
		// 	userId,
		// 	service: logService,
		// 	type: logType,
		// });

    }catch(error: any) {
		console.log(error.message);
		if (error.message == "Invalid input") {
			return res.status(400).json({error: error.message});
		}
		if (error.message == "Prompt not found") {
			return res.status(404).json({error: error.message});
		}
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const getAiVoicePrompt = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "AI VOICE PROMPT";
	const logType = "get_flow_data";
	
	const { organizationId, projectId } = req.params;
    const { clerk_id } = req.userInfo;

	if( !organizationId || !projectId || projectId == undefined || projectId == null) {
		return res.status(400).json({error: "Invalid input"});
	}

	const { limit = 10, skip = 0, archive = false, isOrganization = false, category} = req.query;
	try {
		let pipeline: any = [];

		pipeline.push({
			$match: {
				is_deleted: false,
				is_organization: isOrganization ? true : false,
				archive_status: !!archive,
			},
		});

		pipeline.push({
			$lookup: {
				from: "prompts",
				localField: "prompt_id",
				foreignField: "_id",
				as: "promptInfo",
			},
		})

		pipeline.push ({
			$unwind: {
				path: "$promptInfo",
				preserveNullAndEmptyArrays: true,
			},
		})

		pipeline.push({
			$addFields: {
				prompt_id: "$promptInfo._id", 
				prompt_type: "$promptInfo.prompt_type",
				project_id: "$promptInfo.project_id",
				organization_id: "$promptInfo.organization_id",
				author: "$promptInfo.author",
				updatedAt: "$promptInfo.updatedAt",
				cloned: "$promptInfo.isCloned",
			},
		})

		if ( isOrganization) {
			pipeline.push({
				$match: {
					organization_id: organizationId 
				}
			})
		}else {
			pipeline.push({
				$match: {
					project_id: new Types.ObjectId(projectId),
					organization_id: organizationId 
				}
			})
		}


		pipeline.push({
			$sort: {
				version: 1,
			},
		});

		pipeline.push({
			$group: {
				_id: "$prompt_id",
				orchestrateId: {
					$last: "$_id",
				},
				promptId: {
					$first: "$prompt_id"
				},
				promptName: {
					$first: "$prompt_title",
				},
				promptCategory: {
					$first: "$category",
				},
				projectId: {
					$first: "$project_id",
				},
				promptText: {
					$first: "$prompt_text",
				},
				organizationId: {
					$first: "$organization_id",
				},
				author: {
					$first: "$author",
				},
				introPrompt: {
					$first: "$intro_prompt",
				},
				businessLogicType: {
					$first: "$business_logic_type",
				},
				closurePrompt: {
					$first: "$closure_prompt",
				},
				isOrganization: {
					$first: "$is_organization",
				},
				flowiseId: {
					$first: "$flowise_id",
				},
				flowisePage: {
					$first: "$flowise_page",
				},
				version: {
					$first: "$version",
				},
				versions: {
					$push: "$version",
				},
				updatedAt: {
					$first: "$updatedAt",
				},
				run: {
					$first: "$runs",
				},
				isCloned: {
					$first: "$cloned",
				},
				isArchive: {
					$first: "$archive_status",
				},
			},
		})

		pipeline.push({
			$project: {
				_id: "$orchestrateId",
				promptId: 1,
				organizationId: 1,
				projectId: 1,
				promptName: 1,
				promptCategory: 1,
				promptText: 1,
				author: 1,
				introPrompt: 1,
				businessLogicType: 1,
				closurePrompt: 1,
				flowiseId: 1,
				flowisePage: 1,
				jsonPromptFlow: 1,
				version: 1,
				versions: 1,
				updatedAt: 1,
				run: 1,
				isOrganization: 1,
				isCloned: 1,
				isArchive: 1,
			},
		})

		if (archive) {
			pipeline.push({
				$match: {
					isArchive: true,
				},
			})
		}
		if (category) {
			pipeline.push({
				$match: {
					promptCategory: category,
				},
			})
		}

		pipeline.push({
			$facet: {
				total: [{ $count: "count" }],
				data: [
					{ $sort: { updatedAt: -1 } },
					{ $skip: +skip },
					{ $limit: +limit },
				],
			},
		});

		// console.log(JSON.stringify(pipeline));
		const dbResponse = await AiVoiceModel.aggregate(pipeline);
		res.status(200).json({
			data: dbResponse[0].data || [],
			count: dbResponse[0]?.total[0]?.count || 0,
		});
		// await createSuccessLog({
		// 	clerk_id,
		// 	organizationId,
		// 	projectId,
		// 	service: logService,
		// 	type: logType,
		// });
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if( error.message == "Invalid input in params.") {
			return res.status(400).json({ error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getOrchestrateDataByVersion = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "get_prompt_by_version";

	const { promptId, version } = req.params;

	try {
		if (!promptId || !version) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		let pipeline: any = [];
		pipeline = [
			{
				$match: {
					prompt_id: new Types.ObjectId(promptId),
					version: +version,
				},
			},
			{
				$lookup: {
					from: "prompts",
					localField: "prompt_id",
					foreignField: "_id",
					as: "promptInfo",
				},
			},
			{
				$unwind: {
					path: "$promptInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: "$_id",
					organizationId: "$promptInfo.organization_id",
					projectId: "$promptInfo.project_id",
					author: "$promptInfo.author",
					promptId: "$prompt_id",
					promptName: "$prompt_title",
					promptCategory: "$category",
					promptText: "$prompt_text",
					introPrompt: "$intro_prompt",
					businessLogicType: "$business_logic_type",
					closurePrompt: "$closure_prompt",
					flowiseId: "$flowise_id",
					flowisePage: "$flowise_page",
					updatedAt: 1,
					run: "$runs",
					isOrganization: "$is_orgainzation",
					cloned: 1,
					isArchive: "$archive_status",
					version: 1
				},
			},
		];
		// console.log(JSON.stringify(pipeline));
		let promptData = await AiVoiceModel.aggregate(pipeline);

		pipeline = [
			{
				$match: {
					_id: new Types.ObjectId(promptId),
				},
			},
			{
				$lookup: {
					from: "ai_voice_prompt",
					localField: "_id",
					foreignField: "prompt_id",
					as: "promptVariantInfo",
				},
			},
			{
				$unwind: {
					path: "$promptVariantInfo",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					versions: "$promptVariantInfo.version",
				},
			},
			{
				$group: {
					_id: "$_id",
					versions: {
						$push: "$versions",
					},
				},
			},
		];
		let versionsInfo = await PromptModel.aggregate(pipeline);
		let promptInfo: any = {};
		promptInfo = promptData ? promptData[0] : {};
		if (versionsInfo.length > 0) {
			if (promptInfo !== undefined) {
				let versionList = versionsInfo[0].versions;
				promptInfo.versions = versionList;
			}
		}
		res.status(200).json({ data: promptInfo || {} });
		await createSuccessLog({
			// userId: clerk_id,
			promptId,
			service: logService,
			type: logType,
		});
		
	} catch (error) {
		console.log(error, "err");
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const clonePrompt = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "AI VOICE PROMPT";
	const logType = "clone_prompt";
	const event = "notification";
	// console.log( req.userInfo);
	const { clerk_id: userId } = req.userInfo;

	const { organizationId, projectId, } = req.params;
	const { promptId, version } = req.body;

	try {
		if (!promptId || !version || !userId || !projectId) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		let promptInfo = await AiVoiceModel.findOne({
			prompt_id: promptId,
			version: version,
			is_deleted: false,
			archive_status: false,
		});
		if (!promptInfo) {
			throw new Error("Prompt data not found");
		}
		const promptQuery: any = {
			organization_id: organizationId,
			project_id: projectId,
			author: userId,
			prompt_type: "PROJECT",
			aiVoicePrompt: true,
			isCloned: true,
		};

		const promptData = await PromptModel.create(promptQuery);

		const promptVersionQuery = {
			prompt_id: promptData._id,
			prompt_title: promptInfo.prompt_title,
			category: promptInfo.category,
			prompt_text: promptInfo.prompt_text,
			intro_prompt: promptInfo.intro_prompt,
			business_logic_type: promptInfo.business_logic_type,
			closure_prompt: promptInfo.closure_prompt,
			is_organization: promptInfo.is_organization,
			flowise_id: promptInfo.flowise_id,
			flowise_page: promptInfo.flowise_page,
			version: promptInfo.version,
		}
		const dbResponse = await AiVoiceModel.create(promptVersionQuery);
		res.status(200).json({ message: "Prompt updated successfully", data: dbResponse });

		await createSuccessLog({
			userId: userId,
			projectId,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed",
		});
		
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			userId: userId,
			projectId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Prompt data not found"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Prompt version data not found"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const archivePromptData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "AI VOICE PROMPT";
	const logType = "clone_prompt";
	const event = "notification";

	const { promptId, version } = req.params;
	const { clerk_id: userId } = req.userInfo;
	try {
		if (!promptId || !version || !userId) {
			return res.status(400).json({ error: "Invalid input" });
		}
		const promptInfo = await AiVoiceModel.findOne({
			prompt_id: promptId,
			version: + version,
		});

		if (!promptInfo) return res.status(404).json({ error: "Prompt data not found"});

		let archiveStatus = promptInfo.archive_status;
		
		await AiVoiceModel.findOneAndUpdate({
				prompt_id: promptId,
				version: + version,
			},
			{
				$set: {
					archive_status: !archiveStatus
				}
			}
		);
		
		res.status(200).json({ message: "Data Updated successfully" });
	} catch (error) {
		console.log(error, "err");
		return res.status(500).json({ error: "Internal Server error" });
	}
};

