import { json, Request, Response } from "express";
import {
	OrchestrateModel,
	ProjectModel,
	PromptModel,
	PromptVersionModel,
	TokenModel,
} from "../../core/data/models";
import { Types } from "mongoose";
import { createErrorLog, createNotificationLog, createSuccessLog } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";
import axios from "axios";
import { CHAT_THREAD_ATTRIBUTE } from "../../core/data/IOpenAiChatThread";
import OpenAiChatThread from "../../core/data/models/openAiChatThread";

export const createOrchestrateChat = async (req: Request, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "create_chat_thread";

	try{
		const { flowId } = req.params;
		if ( !flowId) {
			throw new Error("Invalid input");
		}
		let orchestrateFlow = await OrchestrateModel.findOne({
			flowise_id: flowId,
		});

		if (!orchestrateFlow) {
			throw new Error("Orchestrate flow not found");
		}
		// console.log("orchestrateFlow :::::::::::", orchestrateFlow);
		let chatThreadObject = {
			name: orchestrateFlow.flow_name,
			organization_id: orchestrateFlow.organization_id,
			project_id: orchestrateFlow.project_id,
			user_id: orchestrateFlow.author,
			type: CHAT_THREAD_ATTRIBUTE,
			chat_thread_type: "orchestrate",
			flowise_id: orchestrateFlow.flowise_id,
		};
		let createChatThread = await OpenAiChatThread.create(chatThreadObject);

		res.status(200).json({ message: "Prompt Chat created successfully", data: createChatThread });

		// await createSuccessLog({
		// 	userId: orchestrateFlow.author,
		// 	service: logService,
		// 	type: logType,
		// })
	}
	catch(error: any){
		console.log(error);
		return res.status(500).json({ error: "Internal Server error" });
		// await createErrorLog({
		// 	userId: orchestrateFlow.author,
		// 	promptId
		// 	service: logService,
		// 	type: logType,
		// 	message: `${error.message}`,
		// });
	}
}

export const getFlowiseDataByflowId = async (req: Request, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "get_orchestarte_data";

	try{
		const { flowId } = req.params;
		if ( !flowId) {
			throw new Error("Invalid input");
		}
		let orchestrateFlow = await OrchestrateModel.findOne({
			flowise_id: flowId,
		});

		return res.status(200).json({ message: "Prompt Chat created successfully", data: orchestrateFlow });
	}
	catch(error: any){
		console.log(error);
		return res.status(500).json({ error: "Internal Server error" });
	}
}

export const addPromptFlowData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "upsert_flow_data";
	const event = "notification";

	let { clerk_id } = req.userInfo;
	let {
		name,
		organizationId, //added
		promptId,
		version,
		userId,
		jsonData,
		projectId,
		isUpdated = false,
		category,
	} = req.body;
	try {
		if (!isUpdated) {
			if (
				!name ||
				!promptId ||
				!version ||
				!userId ||
				!jsonData ||
				!projectId ||
				!category
			) {
				throw new Error("Invalid input");
			}
		}

		if (
			!promptId ||
			!version ||
			!userId ||
			!jsonData ||
			!projectId ||
			!category
		) {
			return res.status(400).json({ error: "Invalid input" });
		}


		let orchestrateFlow = await OrchestrateModel.findOne({
			prompt_id: promptId,
			version: version,
			is_deleted: false,
			flow_name: name,
		});
		let versionCount = await OrchestrateModel.find({
			prompt_id: promptId,
			is_deleted: false,
		});
		if (!orchestrateFlow) {
			await OrchestrateModel.create({
				flow_name: name,
				project_id: projectId,
				prompt_id: promptId,
				prompt_version: version,
				author: userId,
				json_prompt_flow: jsonData,
				category,
			});
		} else {
			let autoIncrementVersion = versionCount.length;
			autoIncrementVersion++;
			await OrchestrateModel.create({
				flow_name: orchestrateFlow.flow_name,
				project_id: orchestrateFlow.project_id,
				prompt_id: orchestrateFlow.prompt_id,
				prompt_version: orchestrateFlow.prompt_version,
				version: autoIncrementVersion,
				author: userId,
				json_prompt_flow: jsonData,
				category,
			});
		}

		res.status(200).json({
			message: "Orchestrate flow data added successfully",
		});

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed"
		})
		await createSuccessLog({
			userId,
			projectId,
			promptId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		
		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed"
		})

		await createErrorLog({
			userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if (error.message == "Invalid input") {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const getOrchestrateFlow = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "get_flow_data";
	
	// let { clerk_id } = req.userInfo;
	let { projectId, userId } = req.params;

	if( !projectId || projectId == undefined || projectId == null ||  !userId || userId == undefined) {
		return res.status(400).json({error: "Invalid input"});
	}
	const { limit = 10, skip = 0, archive = false } = req.query;
	try {
		let pipeline: any = [];

		pipeline.push({
			$match: {
				is_deleted: false,
				is_active: true,
				flow_name: {
					$ne: null,
				},
				author: userId,
				project_id: new Types.ObjectId(projectId),
				// organization_id: organizationId,
				archive_status: !!archive,
			},
		});

		pipeline.push({
			$lookup: {
				from: "prompt_versions",
				localField: "prompt_id",
				foreignField: "prompt_id",
				as: "promptInfo",
			},
		});
		pipeline.push({
			$unwind: {
				path: "$promptInfo",
				preserveNullAndEmptyArrays: true,
			},
		});

		pipeline.push({
			$addFields: {
				description: {
					$cond: {
						if: {
							$eq: ["$prompt_version", "$promptInfo.version"],
						},
						then: "$promptInfo.prompt_text",
						else: "",
					},
				},
			},
		});

		pipeline.push({
			$match: {
				description: {
					$ne: "",
				},
			},
		});

		if (archive) {
			pipeline.push({
				$project: {
					_id: 1,
					flow_name: 1,
					prompt_id: 1,
					project_id: 1,
					prompt_title: 1,
					prompt_text: 1,
					organization_id: 1,
					author: 1,
					json_prompt_flow: 1,
					version: 1,
					versions: 1,
					updatedAt: 1,
					category: 1,
					prompt_version: 1,
					archive_status: 1,
					run: 1,
				},
			});
		} else {
			pipeline.push({
				$sort: {
					version: 1,
				},
			});

			pipeline.push({
				$group: {
					_id: "$flow_name",
					orchestrate_id: {
						$last: "$_id",
					},
					flow_name: {
						$first: "$flow_name",
					},
					category: {
						$last: "$category",
					},
					prompt_id: {
						$first: "$prompt_id",
					},
					project_id: {
						$first: "$project_id",
					},
					prompt_title: {
						$first: "$promptInfo.prompt_title",
					},
					prompt_text: {
						$first: "$description",
					},
					organization_id: {
						$first: "$organization_id",
					},
					author: {
						$first: "$author",
					},
					json_prompt_flow: {
						$last: "$json_prompt_flow",
					},
					version: {
						$last: "$version",
					},
					versions: {
						$push: "$version",
					},
					updatedAt: {
						$first: "$updatedAt",
					},
					prompt_version: {
						$last: "$prompt_version",
					},
					run: {
						$last: "$run",
					},
				},
			});

			pipeline.push({
				$project: {
					_id: "$orchestrate_id",
					flow_name: 1,
					prompt_id: 1,
					project_id: 1,
					prompt_title: 1,
					prompt_text: 1,
					organization_id: 1,
					author: 1,
					json_prompt_flow: 1,
					version: 1,
					versions: 1,
					updatedAt: 1,
					category: 1,
					prompt_version: 1,
					run: 1,
				},
			});
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
		const orchestrateFlow = await OrchestrateModel.aggregate(pipeline);
		res.status(200).json({
			data: orchestrateFlow[0].data || [],
			count: orchestrateFlow[0]?.total[0]?.count || 0,
		});
		// await createSuccessLog({
		// 	userId,
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

export const getOrchestrateVersion = async (req: AuthenticatedRequest, res: Response) => {
	// let { clerk_id } = req.userInfo;
	let { projectId, userId } = req.params;
	let { title, version } = req.body;
	try {

		if (!title || !version) {
			return res.status(400).json({ error: "Invalid input" });
		}

		let pipeline: any = [];
		let vPipeline: any = [];
		// pipeline = [
		pipeline.push({
			$match: {
				is_deleted: false,
				flow_name: title,
				version: +version,
				author: userId,
				project_id: new Types.ObjectId(projectId),
			},
		});
		pipeline.push({
			$lookup: {
				from: "prompt_versions",
				localField: "prompt_id",
				foreignField: "prompt_id",
				as: "promptInfo",
			},
		});
		pipeline.push({
			$unwind: {
				path: "$promptInfo",
				preserveNullAndEmptyArrays: true,
			},
		});
		pipeline.push({
			$addFields: {
				description: {
					$cond: {
						if: {
							$eq: ["$prompt_version", "$promptInfo.version"],
						},
						then: "$promptInfo.prompt_text",
						else: "",
					},
				},
			},
		});
		pipeline.push({
			$match: {
				description: {
					$ne: "",
				},
			},
		});
		pipeline.push({
			$group: {
				_id: "$_id",
				flow_name: {
					$first: "$flow_name",
				},
				prompt_id: {
					$first: "$prompt_id",
				},
				project_id: {
					$first: "$project_id",
				},
				prompt_title: {
					$first: "$promptInfo.prompt_title",
				},
				prompt_text: {
					$first: "$description",
				},
				organization_id: {
					$first: "$organization_id",
				},
				author: {
					$first: "$author",
				},
				json_prompt_flow: {
					$last: "$json_prompt_flow",
				},
				prompt_version: {
					$last: "$prompt_version",
				},
				version: {
					$last: "$version",
				},
				orchestrate_version: {
					$first: "$version",
				},
				versions: {
					$push: "$version",
				},
				updatedAt: {
					$first: "$updatedAt",
				},
				category: {
					$first: "$category",
				},
				run: {
					$first: "$run",
				},
			},
		});
		pipeline.push({
			$project: {
				_id: 1,
				flow_name: 1,
				organization_id: 1,
				prompt_id: 1,
				project_id: 1,
				prompt_title: 1,
				prompt_text: 1,
				author: 1,
				json_prompt_flow: 1,
				version: 1,
				updatedAt: 1,
				prompt_version: 1,
				category: 1,
				run: 1,
			},
		});
		// console.log(JSON.stringify(pipeline));
		let orchestrateFlow = await OrchestrateModel.aggregate(pipeline);
		if (orchestrateFlow.length == 0) {
			return res.status(200).json({ data: {} });
		}
		let orcInfo = orchestrateFlow[0];
		vPipeline = [
			{
				$match: {
					is_deleted: false,
					flow_name: title,
					project_id: new Types.ObjectId(projectId),
					archive_status: false,
				},
			},
			{
				$group: {
					_id: "$flow_name",
					prompt_id: {
						$first: "$prompt_id",
					},
					orchestrate_versions: {
						$push: "$version",
					},
				},
			},
			{
				$lookup: {
					from: "prompt_versions",
					localField: "prompt_id",
					foreignField: "prompt_id",
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
				$group: {
					_id: "$_id",
					orchestrate_versions: {
						$first: "$orchestrate_versions",
					},
					prompt_versions: {
						$push: "$promptInfo.version",
					},
				},
			},
			{
				$project: {
					_id: 0,
					orchestrate_versions: 1,
					prompt_versions: 1,
				},
			},
		];
		let versionsInfo = await OrchestrateModel.aggregate(vPipeline);
		if (versionsInfo.length > 0) {
			let versionData = versionsInfo[0];
			let data = { ...orcInfo, ...versionData };
			return res.status(200).json({ data: data });
		}
		res.status(200).json({ data: orcInfo });
	} catch (error) {
		console.log(error);
		// await createErrorLog({
		// userId: clerk_id,
		// 	service: logService,
		// 	type: logType,
		// 	message: `${error.message}`,
		// });
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const runPromptOrchestrateFlow = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "run_flow";

	// let { clerk_id } = req.userInfo;
	let { promptId, version, userId, jsonData } = req.body;
	try {
		let run = 0;
		if (!promptId || !version || !userId || !jsonData) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}

		let authorIsValid = await PromptModel.findOne({
			_id: promptId,
			author: userId,
		});

		if (!authorIsValid) {
			// return res.status(401).json({ error: "Unauthorized Access" });
			throw new Error("Unauthorized Access");
		}

		let promptInfo = await PromptVersionModel.findOne({
			prompt_id: promptId,
			version,
			is_deleted: false,
		});

		if (!promptInfo) {
			// return res.status(400).json({ error: "Prompt data not found" });
			throw new Error("Prompt data not found");
		}
		run = promptInfo.runs;
		run++;

		await PromptVersionModel.updateOne(
			{
				prompt_id: promptId,
				version: version,
			},
			{
				runs: run,
			}
		);
		res.status(200).json({
			message: "Orchestrate flow run successfully",
		});
		await createSuccessLog({
			userId,
			promptId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		await createErrorLog({
			// userId: clerk_id,
			promptId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if (error.message == "Invalid input") {
			return res.status(400).json({ error: error.message });
		}
		if (error.message == "Unauthorized Access") {
			return res.status(400).json({ error: error.message });
		}
		if (error.message == "Prompt data not found") {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const runOrchestrateFlow = async (req: Request, res: Response) => {
	try {
		let { orchestrateId } = req.query;
		if (!orchestrateId) {
			return res.status(400).json({ error: "Invalid input" });
		}
		let orchestrateInfo = await OrchestrateModel.findOne({
			_id: orchestrateId,
		});
		if (!orchestrateInfo) {
			return res
				.status(404)
				.json({ error: "Orchestrate data not found" });
		}
		let run = orchestrateInfo.run;
		run++;

		await OrchestrateModel.updateOne({ _id: orchestrateId }, { run: run });

		res.status(200).json({
			message: "Orchestrate data updated successfully",
		});
	} catch (error) {
		console.log(error, "err");
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const archiveOrchestrateFlowData = async ( req: Request, res: Response ) => {
	const logService = "ORCHESTRATE";
	const logType = "archive_flow";
	const event = "notification";

	let { version, status, flow_name, organizationId } = req.body;

	let { projectId, userId } = req.params;

	try {
		if (!projectId || !version || !userId || !flow_name || !organizationId) {
			throw new Error("Invalid input");
		}
		if( status == undefined || status == null) {
			throw new Error("Invalid input in status");
		}

		// createNotificationLog({
		// 	event: event,
		// 	userId: userId,
		// 	organizationId: organizationId,
		// 	title: status? logType: "unarchive_flow",
		// 	projectId: projectId,
		// 	service: logService,
		// 	status: "Progress"
		// });

		let orchestrateFlow = await OrchestrateModel.findOne({
			project_id: new Types.ObjectId(projectId),
			version: version,
			is_deleted: false,
			flow_name,
		});

		if (!orchestrateFlow) {
			throw new Error("Orchestrate data not found");
		}

		orchestrateFlow.archive_status = status;

		orchestrateFlow.save();

		res.status(200).json({
			message: "Orchestrate archive status updated successfully",
		});

		await createSuccessLog({
			userId: userId,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: status? logType: "unarchive_flow",
			projectId: projectId,
			service: logService,
			status: "Completed"
		});
	} catch (error: any) {
		await createErrorLog({
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: status? logType: "unarchive_flow",
			projectId: projectId,
			service: logService,
			status: "Failed"
		});
		if (error.message == "Invalid input in status"){
			return res.status(400).json({error: error.message});
		}
		if (error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if (error.message == "Orchestrate data not found"){
			return res.status(404).json({error: error.message});
		}
		console.log(error);
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const getOrchestrateDataByVersion = async (
	req: Request,
	res: Response
) => {
	let { projectId, userId, version } = req.params;
	let { flow_name } = req.query;
	// console.log(flow_name, "floo");
	try {
		if (!projectId || !version || !userId || !flow_name) {
			return res.status(400).json({ error: "Invalid input" });
		}
		let orchestrateFlow = await OrchestrateModel.findOne({
			project_id: new Types.ObjectId(projectId),
			version: version,
			is_deleted: false,
			flow_name,
			author: userId,
		});
		if (!orchestrateFlow) {
			return res.status(404).json({ error: "Orchestrate not found" });
		}
		res.status(200).json({ success: true, orchestrateFlow });
	} catch (error) {
		console.log(error, "err");
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const addPromptFlowiseFlow = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "Flow_data_created";
	const event = "notification";
	let {
		name,
		organizationId, //added
		userId,
		projectId,
		flowiseId,
		isOrganization = false,
		isCloned = false,
		promptId
	} = req.body;
	try {
		// createNotificationLog({
		// 	event: event,
		// 	userId: userId,
		// 	organizationId: organizationId,
		// 	title: name,
		// 	projectId: projectId,
		// 	service: logService,
		// 	status: "Progress"
		// });

		await OrchestrateModel.create({
			flow_name: name,
			organization_id: organizationId,
			project_id: isOrganization ? null : projectId,
			author: userId,
			flowise_id: flowiseId,
			is_organization: isOrganization,
			cloned: isCloned,
			prompt_id: promptId,
		});	
		res.status(200).json({ message: "Flow saved successfully."})
		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed"
		})
		await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		
		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed"
		})

		await createErrorLog({
			userId: userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if (error.message == "Invalid input") {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal Server error" });
	}
};

export const getFlowiseByFlowId = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORCHESTRATE";
	const logType = "get_flow_data";
	
	const { organizationId, projectId } = req.params;
	const { isOrganization = false, limit = 10, skip = 0, isAll = 0 } = req.query;

	try {
		let pipeline: any = [];


		let query= {};
		if (isOrganization){
			query = {
				organization_id: organizationId,
				is_organization: true,
			}
		}else {
			query = {
				project_id: new Types.ObjectId(projectId),
				is_organization: false,
			}
		}

		pipeline = [
			{
				$match: query,
			},
			{
				$match: {
					$and: [
						{
							flowise_id: {
								$ne: "",
							},
						},
						{
							flowise_id: {
								$ne: null,
							},
						},
					],
				},
			},
			{
				$facet: {
					total: [{ $count: "count" }],
					data: isAll? []:[
						{ $skip: +skip },
						{ $limit: +limit },
					],
				},
			}
		]
		let flowData = await OrchestrateModel.aggregate(pipeline)
		if( flowData.length == 0) {
			return res.status(200).json({data: []});
		}
		const flowInfo = flowData[0].data;
		
		const dbResponse = await Promise.all(
			flowInfo.map(async (element) => {
				if (!element.flowise_id) return null; // Skip if no flowwise_id

				try {
					const response = await axios.get(
						`${process.env.API_BASE_URL_4CX_FLOW}/chatflows/${element.flowise_id}`,
						{
							headers: { "x-request-from": "internal" },
						}
					);
					const flowiseData = response.data;
					flowiseData.cloned = element?.cloned
					return flowiseData;
				} catch (error: any) {
					return null;
				}
			})
		);
		const filteredResponse = dbResponse.filter(Boolean);

		res.status(200).json({ data: filteredResponse, total: flowData[0]?.total[0]?.count || 0 });
	} catch (error: any) {
		
		await createSuccessLog({
			// userId,
			organizationId,
			projectId,
			service: logService,
			type: logType,
		});
		console.log(error);
		if(error.message == "Orchestrate flow not foud") {
			return res.status(404).json({error: error.message});
		}
		await createErrorLog({
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const verifyFlowsAuthor = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	const logService = "ORCHESTRATE";
	const logType = "verify_author";

	const { organizationId, projectId, flowiesId } = req.params;
	let { clerk_id } = req.userInfo;

	let authorIdentity: boolean = false;

	try {
		let pipeline: any = [
			{
				$match: {
					clerk_org_id: organizationId,
				},
			},
			{
				$unwind: {
					path: "$collaborators",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$match: {
					$or: [
						{
							collaborators: clerk_id,
						},
						{
							owner_id: clerk_id,
						},
						{
							collaborators: {
								$ne: ""
							}
						},
					],
				},
			},
		];
		// console.log(JSON.stringify(pipeline));
		const verifyOrganizationMember = await ProjectModel.aggregate(pipeline);

		if (verifyOrganizationMember.length == 0) {
			return res.status(401).json({ error: "Unauthorized access" });
		}

		const checkAuthor = await OrchestrateModel.findOne({
			flowise_id: flowiesId,
			author: clerk_id,
		});
		if (checkAuthor) {
			// console.log(checkAuthor);
			authorIdentity = true;
		}
		res.status(200).json({ authorIsValid: authorIdentity });
	} catch (error: any) {
		await createSuccessLog({
			// userId,
			organizationId,
			projectId,
			service: logService,
			type: logType,
		});
		console.log(error);
		if (error.message == "Orchestrate flow not found") {
			return res.status(404).json({ error: error.message });
		}
		await createErrorLog({
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const countToken = async (req: Request, res: Response) => {
	try{
		// const { organizationId, projectId, userId } = req.params;
		const { flowId } = req.params;

		if (!flowId) {
			return res.status(400).json({error: "Invalid input"});
		}

		const flowInfo = await OrchestrateModel.findOne({
			flowise_id: flowId
		})

		if (!flowInfo) {
			return res.status(404).json({ error: "Orchestarte flow not found"});
		}

		const { prompt, user_question, conversation_history, response, modelType, widgetId, shopName, chatThredId  }= req.body;
		let tokenCount = {};
		await axios.post(`https://fourcx-openai.azurewebsites.net/api/CountTokensGranular?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ==`,{
            "prompt": prompt,
            "user_question": user_question,
            "conversation_history": conversation_history,
            "response": response,
        })
        .then(function (response) {
            // console.log("done", response?.data);
			tokenCount = response?.data
        })
        .catch(function (error) {
            console.log(error.message);
        });

		tokenCount = { 
			...tokenCount,
			organization_id: flowInfo.organization_id,
			project_id:  flowInfo.project_id,
			user_id: flowInfo.author,
			flow_id: flowId,
			modelType: modelType,
			chat_thread_id: chatThredId,
			widget_id: widgetId,
			shop_name: shopName,
		};

		const dbResponse = await TokenModel.create(tokenCount);

		return res.status(200).json({ "messgae": dbResponse});
	}
	catch {
		return res.status(500).json({ error: "Internal server error"});
	}

}