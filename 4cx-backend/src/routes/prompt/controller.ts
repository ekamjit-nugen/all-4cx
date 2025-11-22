import { Request, Response } from "express";
import { Types } from "mongoose";
import {
	OrganizationModel,
	PromptModel,
	PromptVersionModel,
} from "../../core/data/models";
import { createErrorLog, createNotificationLog, createSuccessLog } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";
import { CHAT_THREAD_ATTRIBUTE } from "../../core/data/IOpenAiChatThread";
import OpenAiChatThread from "../../core/data/models/openAiChatThread";

export const addPromptData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "create_prompt";
	const event = "notification";

	let { clerk_id } = req.userInfo;

	let {
		organizationId,
		projectId,
		title,
		category,
		text,
		isOrganization = false,
		userId,
	} = req.body;
	
	try {
		if (!organizationId || !title || !category || !text || !userId) {
			// return res.status(400).json({ error: "Invalid input in payload" });
			throw new Error("Invalid input in payload");
		}
		if (!isOrganization) {
			if (!projectId) {
				// return res.status(400).json({ error: "ProjectId is required" });
				throw new Error("ProjectId is required");
			}
		}

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: title,
			projectId: projectId,
			service: logService,
			status: "Progress"
		});

		let userAuth = await OrganizationModel.findOne({
			createdBy: userId,
		});
		if (!userAuth) {
			// return res.status(401).json({ error: "Unauthorized access" });
			throw new Error("Unauthorized access");
		}

		let query: any = {
			organization_id: organizationId,
			author: userId,
			prompt_type: isOrganization ? "ORGANIZATION" : "PROJECT",
		};
		if (!isOrganization) {
			query.project_id = projectId;
		}
		let promptData = await PromptModel.create(query);
		const promptId = promptData._id;

		await PromptVersionModel.create({
			prompt_id: promptId,
			prompt_title: title,
			prompt_text: text,
			category,
		});
		res.status(200).json({ message: "Prompt created successfully" });

		await createSuccessLog({
			userId: clerk_id,
			organizationId,
			projectId,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: title,
			projectId: projectId,
			service: logService,
			status: "Completed"
		})
	} catch (error: any) {
		console.log(error);
		
		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: title,
			projectId: projectId,
			service: logService,
			status: "Failed"
		});

		createErrorLog({
			userId: clerk_id,
			organizationId,
			projectId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Invalid input in payload"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "ProjectId is required"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Unauthorized access"){
			return res.status(401).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPrompts = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "get_all_prompt";
		
	// let { clerk_id } = req.userInfo;

	let {
		organizationId,
		projectId,
		isOrganization = false,
		search = "",
		limit = 10,
		skip = 0,
	} = req.query;
	try {
		let pipeline: any = [];
		let query = {};
		let searchQuery = {};
		if (
			typeof organizationId !== "string" ||
			typeof projectId !== "string" ||
			organizationId == undefined ||
			projectId == undefined || !projectId
		) {
			// return res.status(400).json({ error: "Invalid organizationId or projectId" });
			throw new Error("Invalid organizationId or projectId");
		}
		if (isOrganization) {
			query = {
				organization_id: organizationId,
				prompt_type: "ORGANIZATION",
			};
		} else {
			query = {
				organization_id: organizationId,
				project_id: new Types.ObjectId(projectId),
				prompt_type: "PROJECT",
			};
		}
		if (search) {
			searchQuery = {
				$or: [
					{
						prompt_title: {
							$regex: `${search}`,
							$options: `i`,
						},
					},
					{
						category: {
							$regex: `${search}`,
							$options: `i`,
						},
					},
				],
			};
		}

		pipeline = [
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
					prompt_id: 1,
					prompt_title: 1,
					prompt_text: 1,
					runs: 1,
					category: 1,
					archive_status: 1,
					version: 1,
					cloned: 1,
					is_deleted: 1,
					is_active: 1,
					prompt_type: "$promptInfo.prompt_type",
					project_id: "$promptInfo.project_id",
					organization_id: "$promptInfo.organization_id",
					author: "$promptInfo.author",
					updatedAt: "$promptInfo.updatedAt",
					isCloned: "$promptInfo.isCloned",
				},
			},
			{
				$match: query,
			},
			{
				$match: searchQuery,
			},
			{
				$match: {
					archive_status: false,
				},
			},
			{
				$group: {
					_id: "$prompt_id",
					prompt_id: {
						$first: "$prompt_id",
					},
					prompt_title: {
						$first: "$prompt_title",
					},
					prompt_text: {
						$first: "$prompt_text",
					},
					prompt_type: {
						$first: "$prompt_type",
					},
					runs: {
						$first: "$runs",
					},
					category: {
						$first: "$category",
					},
					archive_status: {
						$first: "$archive_status",
					},
					project_id: {
						$first: "$project_id",
					},
					organization_id: {
						$first: "$organization_id",
					},
					author: {
						$first: "$author",
					},
					cloned: {
						$first: "$cloned",
					},
					versionCount: {
						$count: {},
					},
					versions: {
						$push: "$version",
					},
					version: {
						$first: "$version",
					},
					isCloned: {
						$first: "$isCloned",
					},
					updatedAt: {
						$first: "$updatedAt",
					},
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
		];
		pipeline.push({
			$facet: {
				total: [{ $count: "count" }],
				data: [
					{ $match: {} },
					{ $skip: +skip},
					{ $limit: +limit},
				],
			},
		});
		// console.log(JSON.stringify(pipeline));
		let promptData = await PromptVersionModel.aggregate(pipeline);
		res.status(200).json({ 
			count: promptData[0]?.total[0]?.count || 0,
			data: promptData[0].data || [],
		});
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
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Invalid organizationId or projectId"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getPromptDataByVersion = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "get_prompt_by_version";

	// let { clerk_id } = req.userInfo;
	let { promptId, version } = req.params;
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
					prompt_id: 1,
					prompt_title: 1,
					prompt_text: 1,
					runs: 1,
					category: 1,
					archive_status: 1,
					version: 1,
					cloned: 1,
					is_deleted: 1,
					is_active: 1,
					prompt_type: "$promptInfo.prompt_type",
					project_id: "$promptInfo.project_id",
					organization_id: "$promptInfo.organization_id",
					author: "$promptInfo.author",
					updatedAt: "$promptInfo.updatedAt",
					versionCount: "$promptInfo.version_count",
					isCloned: "$promptInfo.isCloned",
					json_prompt_flow: 1,
				},
			},
		];
		let promptData = await PromptVersionModel.aggregate(pipeline);

		pipeline = [
			{
				$match: {
					_id: new Types.ObjectId(promptId),
				},
			},
			{
				$lookup: {
					from: "prompt_versions",
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
		
	} catch (error: any) {
		console.log(error);
		
		await createErrorLog({
			// userId: clerk_id,
			promptId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const editPrompt = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "update_prompt";

	// let { clerk_id } = req.userInfo;
	let { promptId, version } = req.params;

	try {
		if (promptId == undefined || version == undefined) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		let {
			userId,
			title,
			category,
			text,
			isOrganization = false,
		} = req.body;
		if (!userId) {
			// return res.status(400).json({ error: "Invalid input in payload" });
			throw new Error("Invalid input in payload");
		}
		let promptData = await PromptModel.findOne({
			_id: promptId,
			is_deleted: false,
		});
		let promptVersionData = await PromptVersionModel.findOne({
			prompt_id: promptId,
			version: +version,
		});

		if (!promptVersionData) {
			// return res.status(404).json({ error: "No prompt data found" });
			throw new Error("Prompt data not found");
		}

		let authorIsValid = await PromptModel.findOne({
			_id: promptId,
			author: userId,
		});
		if (!authorIsValid) {
			// return res.status(401).json({
			// 	error: "Unauthorized access can't perform this action",
			// });
			throw new Error("Unauthorized access can't perform this action");
		}

		let versionLength = await PromptVersionModel.find({
			prompt_id: promptId,
		});
		let versionCount = versionLength.length;
		let count = versionCount + 1;
		await PromptModel.updateOne(
			{ _id: promptId },
			{ version_count: count }
		);
		let query = {
			prompt_id: promptVersionData.prompt_id,
			prompt_title: promptVersionData.prompt_title,
			prompt_text: text,
			category: promptVersionData.category,
			version: count,
		};
		let prompt = await PromptVersionModel.create(query);
		if (isOrganization) {
			let PromptQuery = {
				organization_id: promptData?.organization_id,
				project_id: promptData?.project_id,
				prompt_type: "ORGANIZATION",
				version_count: 1,
				author: promptData?.author,
			};
			let orgPromptData = await PromptModel.create(PromptQuery);
			let query = {
				prompt_id: orgPromptData._id,
				prompt_title: promptVersionData.prompt_title,
				prompt_text: text,
				category: promptVersionData.category,
				version: 1,
			};
			await PromptVersionModel.create(query);
		}
		res.status(200).json({
			message: "New prompt version is created",
			data: prompt,
		});
		await createSuccessLog({
			// userId: clerk_id,
			promptId,
			service: logService,
			type: logType,
		});
		
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			promptId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Invalid input in payload"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Prompt data not found"){
			return res.status(404).json({error: error.message});
		}
		if(error.message == "Unauthorized access can't perform this action"){
			return res.status(401).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const clonePrompt = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "clone_prompt";

	// let { clerk_id } = req.userInfo;
	let { promptId, projectId, version, userId } = req.body;

	try {
		if (!promptId || !version || !userId || !projectId) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		let promptData = await PromptModel.findOne({
			_id: promptId,
			is_deleted: false,
		});
		if (!promptData) {
			// return res.status(404).json({ error: "Prompt data not found" });
			throw new Error("Prompt data not found");
		}
		let promptVersionData = await PromptVersionModel.findOne({
			prompt_id: promptId,
			version: version,
		});
		if (!promptVersionData) {
			// return res
			// 	.status(404)
			// 	.json({ error: "No data found related to promptId" });
			throw new Error("Prompt version data not found");
		}
		// let authorIsValid = await PromptModel.findOne({
		// 	_id: promptId,
		// 	author: userId,

		// });
		// if (authorIsValid) {
		// 	return res
		// 		.status(401)
		// 		.json({
		// 			error: "Can't clone prompt",
		// 		});
		// }
		let createQuery = {
			organization_id: promptData.organization_id,
			author: userId,
			prompt_type: "PROJECT",
			project_id: projectId,
			isCloned: true,
		};
		let createdPrompt = await PromptModel.create(createQuery);

		let promptVersion = {
			prompt_id: createdPrompt._id,
			prompt_title: promptVersionData.prompt_title,
			prompt_text: promptVersionData.prompt_text,
			category: promptVersionData.category,
			version: 1,
		};
		await PromptVersionModel.create(promptVersion);
		let cloneCount = promptVersionData?.cloned;
		let count = cloneCount + 1;

		await PromptVersionModel.updateOne(
			{
				prompt_id: promptId,
				version: version,
			},
			{
				cloned: count,
			}
		);
		res.status(200).json({ message: "Prompt updated successfully" });
		await createSuccessLog({
			// userId: clerk_id,
			projectId,
			promptId,
			service: logService,
			type: logType,
		});
		
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			projectId,
			promptId,
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

export const getArchivePromptData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "get_archive_prompt";

	// let { clerk_id } = req.userInfo;
	let { userId } = req.query;

	try {
		let pipeline: any = [];
		let query = {};
		if (!userId) {
			// return res.status(400).json({ error: "Invalid userId" });
			throw new Error("Invalid input");
		}

		query = {
			author: userId,
		};
		pipeline = [
			{
				$match: {
					archive_status: true,
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
					prompt_id: 1,
					prompt_title: 1,
					prompt_text: 1,
					runs: 1,
					category: 1,
					archive_status: 1,
					version: 1,
					cloned: 1,
					is_deleted: 1,
					is_active: 1,
					prompt_type: "$promptInfo.prompt_type",
					project_id: "$promptInfo.project_id",
					organization_id: "$promptInfo.organization_id",
					author: "$promptInfo.author",
					updatedAt: "$promptInfo.updatedAt",
				},
			},
			{
				$match: query,
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			// {
			//   $group: {
			// 	_id: "$prompt_id",
			// 	prompt_id: {
			// 	  $first: "$prompt_id"
			// 	},
			// 	prompt_title: {
			// 	  $first: "$prompt_title"
			// 	},
			// 	prompt_text: {
			// 	  $first: "$prompt_text"
			// 	},
			// 	prompt_type: {
			// 	  $first: "$prompt_type"
			// 	},
			// 	runs: {
			// 	  $first: "$runs"
			// 	},
			// 	category: {
			// 	  $first: "$category"
			// 	},
			// 	archive_status: {
			// 	  $first: "$archive_status"
			// 	},
			// 	project_id: {
			// 	  $first: "$project_id"
			// 	},
			// 	organization_id: {
			// 	  $first: "$organization_id"
			// 	},
			// 	author: {
			// 	  $first: "$author"
			// 	},
			// 	cloned: {
			// 	  $first: "$cloned"
			// 	},
			// 	versionCount: {
			// 	  $count: {}
			// 	},
			// 	version: {
			// 	  $first: "$version"
			// 	}
			//   }
			// }
		];
		// console.log(JSON.stringify(pipeline));
		let promptData = await PromptVersionModel.aggregate(pipeline);
		res.status(200).json({ data: promptData || [] });
		await createSuccessLog({
			// userId: clerk_id,
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
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const archivePrompt = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "PROMPT";
	const logType = "archive_prompt";
	const event = "notification";

	// let { clerk_id } = req.userInfo;
	let { promptId, version } = req.params;
	let { userId, status, organizationId, projectId  } = req.body; 
	try {
		if (!userId || !promptId || !version || !organizationId || !projectId) {
			throw new Error("Invalid input");
		}
		if( status == undefined || status == null) {
			throw new Error("Invalid input in status");
		}

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title:  status? logType: "unarchive_prompt",
			projectId: projectId,
			service: logService,
			status: "Progress"
		});

		let checkPromptIdValid = await PromptVersionModel.findOne({
			prompt_id: promptId,
			version: +version,
		});
		if (!checkPromptIdValid) {
			throw new Error("Prompt version data not found");
		}

		let authorIsValid = await PromptModel.findOne({
			_id: promptId,
			author: userId,
		});

		if (!authorIsValid) {
			throw new Error("Unauthorized access can't perform this action");
		}

		await PromptVersionModel.updateOne(
			{
				prompt_id: promptId,
				version: +version,
			},
			{
				archive_status: status,
			}
		);
		res.status(200).json({ message: "Prompt updated successfully" });
		
		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title:  status? logType: "unarchive_prompt",
			projectId: projectId,
			service: logService,
			status: "Completed"
		});

		await createSuccessLog({
			promptId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		await createErrorLog({
			promptId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title:  status? logType: "unarchive_prompt",
			projectId: projectId,
			service: logService,
			status: "Failed"
		});

		if(error.message == "Invalid input in status"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Unauthorized access can't perform this action"){
			return res.status(400).json({error: error.message});
		}
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAuthorLatestPromptData = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	const logService = "PROMPT";
	const logType = "get_user_prompt_data";
	
	// let { clerk_id } = req.userInfo;
	let { organizationId, projectId, userId } = req.params;
	try {
		let pipeline: any = [];

		pipeline = [];

		pipeline.push({
			$lookup: {
				from: "prompts",
				localField: "prompt_id",
				foreignField: "_id",
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
			$project: {
				prompt_id: 1,
				prompt_title: 1,
				prompt_text: 1,
				runs: 1,
				category: 1,
				archive_status: 1,
				version: 1,
				cloned: 1,
				is_deleted: 1,
				is_active: 1,
				prompt_type: "$promptInfo.prompt_type",
				project_id: "$promptInfo.project_id",
				organization_id: "$promptInfo.organization_id",
				author: "$promptInfo.author",
				updatedAt: "$promptInfo.updatedAt",
				isCloned: "$promptInfo.isCloned",
				json_prompt_flow: 1,
				flow_name: 1,
			},
		});
		pipeline.push({
			$match: {
				archive_status: false,
				author: userId,
				organization_id: organizationId,
			},
		});
		pipeline.push({
			$match: {
				$or: [
					{
						prompt_type: "ORGANIZATION",
					},
					{
						prompt_type: "PROJECT",
						project_id: new Types.ObjectId(projectId),
					},
				],
			},
		});
		pipeline.push({
			$group: {
				_id: "$prompt_id",
				prompt_id: {
					$last: "$prompt_id",
				},
				prompt_title: {
					$last: "$prompt_title",
				},
				prompt_text: {
					$last: "$prompt_text",
				},
				prompt_type: {
					$last: "$prompt_type",
				},
				runs: {
					$last: "$runs",
				},
				category: {
					$last: "$category",
				},
				archive_status: {
					$first: "$archive_status",
				},
				project_id: {
					$last: "$project_id",
				},
				organization_id: {
					$last: "$organization_id",
				},
				author: {
					$last: "$author",
				},
				versions: {
					$push: "$version",
				},
				version: {
					$last: "$version",
				},
				updatedAt: {
					$first: "$updatedAt",
				},
				json_prompt_flow: {
					$first: "$json_prompt_flow",
				},
				flow_name: {
					$first: "$flow_name",
				},
			},
		});
		pipeline.push({
			$sort: {
				updatedAt: -1,
			},
		});
		let promptData = await PromptVersionModel.aggregate(pipeline);
		res.status(200).json({ data: promptData || [] });
		await createSuccessLog({
			organizationId,
			projectId,
			userId,
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
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getAuthorLatestPromptDataNew = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	const logService = "PROMPT";
	const logType = "get_user_latest_prompt";

	// let { clerk_id } = req.userInfo;
	let { organizationId, projectId, userId } = req.params;
	try {
		let { flow = false, archive = false } = req.query;
		let pipeline: any = [];

		pipeline = [];

		pipeline.push({
			$lookup: {
				from: "prompts",
				localField: "prompt_id",
				foreignField: "_id",
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
			$project: {
				prompt_id: 1,
				prompt_title: 1,
				prompt_text: 1,
				runs: 1,
				category: 1,
				archive_status: 1,
				version: 1,
				cloned: 1,
				is_deleted: 1,
				is_active: 1,
				prompt_type: "$promptInfo.prompt_type",
				project_id: "$promptInfo.project_id",
				organization_id: "$promptInfo.organization_id",
				author: "$promptInfo.author",
				updatedAt: "$promptInfo.updatedAt",
				isCloned: "$promptInfo.isCloned",
				json_prompt_flow: 1,
				flow_name: 1,
			},
		});

		pipeline.push({
			$match: {
				author: userId,
				organization_id: organizationId,
			},
		});

		pipeline.push({
			$match: {
				$or: [
					{ prompt_type: "ORGANIZATION" },
					{
						prompt_type: "PROJECT",
						project_id: new Types.ObjectId(projectId),
					},
				],
			},
		});

		if (!archive) {
			pipeline.push({
				$match: {
					archive_status: false,
				},
			});
		} else {
			pipeline.push({
				$match: {
					archive_status: true,
				},
			});
		}

		if (!flow && !archive) {
			pipeline.push({
				$group: {
					_id: "$prompt_id",
					prompt_id: { $last: "$prompt_id" },
					prompt_title: { $last: "$prompt_title" },
					prompt_text: { $last: "$prompt_text" },
					prompt_type: { $last: "$prompt_type" },
					runs: { $last: "$runs" },
					category: { $last: "$category" },
					archive_status: { $first: "$archive_status" },
					project_id: { $last: "$project_id" },
					organization_id: { $last: "$organization_id" },
					author: { $last: "$author" },
					versions: { $push: "$version" },
					version: { $last: "$version" },
					updatedAt: { $first: "$updatedAt" },
					json_prompt_flow: { $first: "$json_prompt_flow" },
					flow_name: { $first: "$flow_name" },
				},
			});
		} else if (flow) {
			pipeline.push({
				$match: {
					flow_name: { $ne: null },
				},
			});
		}

		pipeline.push({
			$sort: {
				updatedAt: -1,
			},
		});
		// console.log(JSON.stringify(pipeline));
		let promptData = await PromptVersionModel.aggregate(pipeline);
		res.status(200).json({ data: promptData || [] });
		await createSuccessLog({
			organizationId, 
			projectId, 
			userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			organizationId, 
			projectId, 
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const createPromptChat = async (req: Request, res: Response) => {
	const logService = "PROMPT";
	const logType = "get_user_latest_prompt";
	const { promptId, version } = req.params;
	try{
		let promptInfo = await PromptModel.findOne({
			_id: promptId,
			is_deleted: false,
			is_active: true,
		})

		if( !promptInfo) {
			return res.status(404).json({ error: "Prompt not found"});
		}
		let promptVersionInfo = await PromptVersionModel.findOne({
			prompt_id: promptId,
			version: version,
		});

		if( !promptVersionInfo) {
			return res.status(404).json({error: "Prompt Data not found"});
		};
		let chatThreadObject = {
			name: promptVersionInfo.prompt_title,
			organization_id: promptInfo.organization_id,
			project_id: promptInfo.project_id,
			user_id: promptInfo.author,
			persona_message_title: promptVersionInfo.prompt_title,
			persona_message: promptVersionInfo.prompt_text,
			type: CHAT_THREAD_ATTRIBUTE,
		};
		let createChatThread = await OpenAiChatThread.create(chatThreadObject);

		res.status(200).json({ message: "Prompt Chat created successfully", data: createChatThread });

		await createSuccessLog({
			promptId,
			service: logService,
			type: logType,
		})
	}
	catch(error: any){
		console.log(error);
		await createErrorLog({
			promptId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
	}
}
