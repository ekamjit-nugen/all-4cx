import { Request, Response } from "express";
import { DataModel, LogsModel, OrchestrateModel, OrganizationModel, OutboundCallModel, ProjectModel, PromptModel, SearchModel, TokenModel } from "../../core/data/models";
import { Types } from "mongoose";
import {
	getUrlCount,
	getBlobName,
	validateUrlAxios,
	createErrorLog,
	createSuccessLog,
	createNotificationLog,
} from "../../utils/commonhelper";
import xlsx from "xlsx";
import fs from "fs";
import { getAzureMetaData, updateAzureMetaData } from "../../utils/upload";
import { AuthenticatedRequest } from "../../middleware/auth";
import path from "path";
import moment from "moment";

export interface CustomRequest extends Request {
	file: any;
	userInfo: any;
}

export const getSourceData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "get_user_data";
	const { userId, data_type, source_type, projectId, limit = 10, skip = 0 } = req.body;
	
	let query = {};

	if (!userId || !projectId) {
		throw new Error("Invalid input");
	}

	try {
		if ( source_type == "generic" || source_type == "crm") {
			query = {
				clerk_id: userId,
				source_type: source_type,
				project_id: new Types.ObjectId(projectId),
				is_deleted: false,
			};
		}
		else{
			query = {
				clerk_id: userId,
				source_type: source_type,
				data_type: data_type,
				project_id: new Types.ObjectId(projectId),
				is_deleted: false,
			};
		}
		let pipeline: any = [];

		// Shared $match stage
		pipeline.push({ $match: query });

		// Folder-specific pipeline stages
		if (data_type === "folder") {
			// pipeline.push({
			// 	$match: {
			// 		data_type: "folder",
			// 	},
			// });
			pipeline.push({
				$addFields: {
					folder_name: {
					  $cond: {
						if: {
						  $gte: [
							{ $indexOfCP: ["$file_name", "/"] },
							0
						  ]
						},
						then: {
						  $substrCP: [
							"$file_name",
							0,
							{ $indexOfCP: ["$file_name", "/"] }
						  ]
						},
						else: "$file_name"
					  }
					}
				}
			});

			pipeline.push({
				$group: {
					_id: "$folder_name",
					folder_name: { $first: "$folder_name"},
					dataId: { $push: "$_id" },
					file_name: { $push: "$file_name" },
					clerk_id: { $first: "$clerk_id" },
					project_id: { $first: "$project_id" },
					source_type: { $first: "$source_type" },
					is_active: { $push: "$is_active" },
					is_deleted: { $push: "$is_deleted" },
					component: { $push: "$component" },
					data_retention_policy: { $push: "$data_retention_policy" },
					encryption_enabled: { $push: "$encryption_enabled" },
					origin: { $push: "$origin" },
					language: { $push: "$language" },
				},
			});

			pipeline.push({ $match: { _id: { $ne: null } } });
		}

		else {
			// pipeline.push({
			// 	$match: {
			// 		data_type: "file",
			// 	},
			// });
			pipeline.push({ $sort: { updatedAt: -1 } });
		}

		// Common pagination and counting
		pipeline.push({
			$facet: {
				total: [{ $count: "count" }],
				data: [
					{ $skip: +skip },
					{ $limit: +limit },
				],
			},
		});

		// Execute pipeline
		// console.log(JSON.stringify(pipeline));
		let dataInfo = await DataModel.aggregate(pipeline);
		let dataCount = dataInfo[0]?.total[0]?.count || 0;
		dataInfo = dataInfo[0].data || [];

		res.status(200).json({ data: dataInfo, dataCount: dataCount });

		await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);

		await createErrorLog({
			projectId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteTenantData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "delete_data_source";
	const event = "notification";

	let { clerk_id } = req.userInfo;
	
	let { dataSourceId, status, organizationId, projectId } = req.body;
	try {
		let blobName: any = "";
		if (!dataSourceId || !status || !organizationId || !projectId) {
			throw new Error("Invalid input");
		}


		let dataSourceInfo = await DataModel.findOne({ _id: dataSourceId });
		if (!dataSourceInfo) {
			throw new Error("DataSource not found");
		}
		let url = dataSourceInfo.url;
		blobName = await getBlobName(url);

		let getBlobData: any = await getAzureMetaData(blobName);
		let metaData: any = {
			is_deleted: "true",
			update_count: "1",
		};
		if (Object.keys(getBlobData).length > 0) {
			let count = getBlobData.update_count;
			metaData.update_count = count;
			await updateAzureMetaData(metaData, blobName);
		} else {
			await updateAzureMetaData(metaData, blobName);
		}
		await DataModel.updateMany(
			{
				_id: new Types.ObjectId(dataSourceId),
			},
			{
				$set: {
					is_deleted: status,
				},
			}
		);
		res.status(200).json({ message: "data updated successfully" });
		await createSuccessLog({
			userId: clerk_id,
			dataSourceId,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed",
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
			status: "Failed",
		});

		await createErrorLog({
			userId: clerk_id,
			dataSourceId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if (error.message === "Invalid input") {
			return res.status(400).json({ error: error.message });
		}
		if (error.message == "DataSource not found") {
			return res.status(404).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getWebSiteUrlCount = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "get_web_site_url_count";
	// let { clerk_id } = req.userInfo;

	try {
		let { url: rawUrl } = req.body;
		let urls: any = [];
		if (!rawUrl) {
			// return res.status(400).json({ error: "Invalid input in url." });
			throw new Error("Invalid input in url");
		}
		if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
			rawUrl = "https://" + rawUrl;
		}
		const parsedUrl = new URL(rawUrl);
		const pathname = parsedUrl.pathname;

		if (!pathname.endsWith("sitemap.xml") && pathname === "/") {
			parsedUrl.pathname = "/sitemap.xml";
		}
		let url = parsedUrl.toString();

		if (url.endsWith("sitemap.xml")) {
			urls = await getUrlCount(url);
		} else {
			urls = await validateUrlAxios(url);
		}
		res.status(200).json({ url: [url], webUrlCount: urls.length || 0 });
		await createSuccessLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: url,
		});
	} catch (error: any) {
		console.log(error.message);

		await createErrorLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if (error.message == "Invalid input in url") {
			return res.status(400).json({ error: error.message });
		}
		if ( error.message == "No response received, invalid input") {
			return res.status(401).json({ error: error.message });
		}
		if ( error.message == "Error while scraping sitemap urls") {
			return res.status(500).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getWebSiteExcelData = async ( req: CustomRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "get_website_excel_data";
	// let { clerk_id } = req.userInfo;

	try {
		let urls: any = [];
		if (!req.file) {
			return res.status(400).json({ error: "please attach file" });
			// throw new Error("please attach file");
		}
		var workbook = xlsx.readFile(req.file.path);
		var sheet_name_list = workbook.SheetNames;
		let data: any = xlsx.utils.sheet_to_json(
			workbook.Sheets[sheet_name_list[0]]
		);
		for (const obj of data) {
			urls.push(obj.url);
		}
		res.status(200).json({ url: urls, webUrlCount: urls.length || 0 });
		await createSuccessLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			// message: urls,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if (error.message === "please attach file") {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: "Internal server error" });
	} finally {
		if (req.file && req.file.path) {
			fs.unlink(req.file.path, (err) => {
				if (err) console.error("Failed to remove file:", err);
			});
		}
	}
};

export const saveDataSourceConfig = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "create_data_config";
	
	const event = "notification";

	const { organizationId, projectId } = req.params;
	const { clerk_id } = req.userInfo;

	try {

		const {
			source_type,
			service,
			name,
			description,
			baseUrl,
			serverCertValidation = false,
			authType,
			userName,
			password,
		} = req.body;
		
		if( !organizationId || !projectId || !source_type || !userName || !password) {
			throw new Error("Invalid input");
		}


		let sourceName = "";
		if( !name) {
			if( source_type == "generic") {
				sourceName = "OData";
			}
			if( source_type == "crm") {
				sourceName = "Dynamic CRM";
			}
		}

		let dataConfigQuery = {
			project_id: projectId,
			clerk_id: clerk_id,
			source_type: source_type,
			service,
			data_config_name: name ? name : sourceName,
			description, 
			url: baseUrl,
			server_certification_validation: serverCertValidation,
			authentication_type: authType,
			user_name: userName,
			password: password
		}

		await DataModel.create(dataConfigQuery);
		res.status(200).json({ message: "data configuration saved successfully"});

		await createSuccessLog({
			userId: clerk_id,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed",
		});
		
	} catch (error: any) {
		if( error.message == "Invalid input") {
			return res.status(400).json({error: error.message});
		}
		await createErrorLog({
			userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed",
		});
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
};

export const updateDataSourceConfig = async ( req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "update_data_config";

	const event = "notification";

	const { organizationId, projectId } = req.params;
	const { clerk_id } = req.userInfo;
	
	const { sourceId } = req.query;
	
	try{
		if( ! organizationId || !projectId || !sourceId ) {
			throw new Error("Invalid input");
		}


		const {
			service,
			name,
			description,
			baseUrl,
			serverCertValidation = false,
			authType,
			userName,
			password,
		 } = req.body;

		let checkDataSourceExist = await DataModel.findOne({
			_id: sourceId,
			project_id: projectId,
			is_deleted: false,
			is_active: true,
		});

		if( !checkDataSourceExist) {
			throw new Error("Data not found");
		}
		await DataModel.updateOne(
			{
				_id: sourceId,
			},
			{
				service: service,
				data_config_name: name,
				description: description,
				url: baseUrl,
				server_certification_validation: serverCertValidation,
				authentication_type: authType,
				user_name: userName,
				password: password,
			}
		);
		res.status(200).json({ message: "Data updated successfully"});
		createSuccessLog({
			userId: clerk_id,
			service: logService,
			type: logType,
		});

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed",
		});
	}
	catch(error: any) {
		await createErrorLog({
			userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		})
		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed",
		});

		if( error.message == "Invalid input") {
			return res.status(400).json({error: error.message});
		}
		if( error.message == "Data not found") {
			return res.status(404).json({error: error.message});
		}
		console.log(error);
		return res.status(500).json({error: "Internal server error"});
	}
}

export const getDataSourceConfig = async (req: AuthenticatedRequest, res: Response) => {
    const { organizationId, projectId, sourceType } = req.params;

    try {
        if (!organizationId || !projectId) throw new Error("Invalid input");

        const query = {
            project_id: new Types.ObjectId(projectId),
            source_type: sourceType,
        };

        const dataConfig = await DataModel.find(query);

        if (!dataConfig) return res.status(404).json({ error: "Data configuration not found" });

        res.status(200).json(dataConfig);

    } catch (error: any) {
        if (error.message === "Invalid input") {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getFileByFileName = async (req: AuthenticatedRequest, res: Response) => {
	try {
	  const { fileName } = req.params;
  
	  if (!fileName) {
		return res.status(400).json({ error: "File name is required" });
	  }
  
	  // Define the public folder path
	  const publicFolderPath = path.join(__dirname, "../../../public");
  
	  // Resolve the full file path
	  const filePath = path.join(publicFolderPath, fileName);
  
	  // Check if the file exists and is within the public folder to prevent path traversal attacks
	  if (!filePath.startsWith(publicFolderPath) || !fs.existsSync(filePath)) {
		return res.status(404).json({ error: "File not found" });
	  }
  
	  // Set headers for download
	  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
	  res.setHeader("Content-Type", "application/octet-stream");
  
	  // Send the file for download
	  return res.status(200).sendFile(filePath, (err) => {
		if (err) {
		  console.error("Error sending file:", err);
		  return res.status(500).json({ error: "Error sending file" });
		}
	  });
	} catch (error: any) {
	  console.error("Error fetching file:", error);
	  return res.status(500).json({ error: "Internal server error" });
	}
};

export const getMetricData = async ( req: AuthenticatedRequest, res: Response ) => {
	try {
		const { organizationId, projectId, userId } = req.params;
		const {
			startDate,
			endDate,
			limit = 5,
			skip = 0,
			tokenUsageModel,
			tokenId,
		} = req.query;

		let dateFilter = {};
		let tokenFilter = {};

		if (startDate && endDate) {
			dateFilter = {
				$and: [
					{
						updatedAtDate: {
							$lte: `${endDate}`,
						},
					},
					{
						updatedAtDate: {
							$gte: `${startDate}`,
						},
					},
				],
			};
		}
		if (tokenUsageModel) {
			tokenFilter = {
				modelType: tokenUsageModel,
			};
			if (tokenId) {
				if ( tokenUsageModel == "widget" ) {
					tokenFilter= {
						...tokenFilter,
						widget_id: new Types.ObjectId(tokenId as string), 
					}
				}
				if ( tokenUsageModel == "orchestrate" ) { 
					tokenFilter= {
						...tokenFilter, 
						flow_id: tokenId 
					} 
				}
				if ( tokenUsageModel == "aiChat" ) { 
					tokenFilter= {
						...tokenFilter,
						chat_thread_id: new Types.ObjectId(tokenId as string)
					}
				}
				if ( tokenUsageModel == "shopify" ) {
					tokenFilter= {
						...tokenFilter, 
						shop_name: tokenId
					}
				}
				if ( tokenUsageModel == "wordpress" ) {
					tokenFilter= {
						...tokenFilter,
						shop_name: tokenId,
					} 
				}
			}
		}

		const organizationCount = await OrganizationModel.find({
			clerk_org_id: organizationId,
			createdBy: userId,
		});

		// const pojectCount = await ProjectModel.aggregate([
		// 	{
		// 		$match: {
		// 			owner_id: userId,
		// 		}
		// 	},
		// 	{
		// 		$addFields: {
		// 		  	updatedAtDate: {
		// 			$dateToString: {
		// 			  date: "$updatedAt",
		// 			  format: "%Y-%m-%d",
		// 			  timezone: "Asia/Kolkata"
		// 			}
		// 		  }
		// 		}
		// 	},
		// 	{
		// 		$match: dateFilter
		// 	}
		// ]);
		let pipeline: any = [];

		pipeline.push({
			$match: {
				clerk_org_id: organizationId,
				owner_id: userId,
			},
		});

		pipeline.push({
			$addFields: {
				updatedAtDate: {
					$dateToString: {
						date: "$updatedAt",
						format: "%Y-%m-%d",
						timezone: "Asia/Kolkata",
					},
				},
			},
		});

		pipeline.push({ $match: dateFilter });

		pipeline.push({
			$sort: {
				updatedAt: -1,
			},
		});

		pipeline.push({
			$unwind: {
				path: "$collaborators",
				preserveNullAndEmptyArrays: false,
			},
		});

		pipeline.push({
			$lookup: {
				from: "tenant",
				localField: "owner_id",
				foreignField: "clerk_id",
				as: "userInfo",
			},
		});

		pipeline.push({
			$unwind: {
				path: "$userInfo",
				preserveNullAndEmptyArrays: false,
			},
		});

		pipeline.push({
			$addFields: {
				updatedAt: {
					$dateToString: {
						date: "$userInfo.updatedAt",
						format: "%Y-%m-%d",
						timezone: "Asia/Kolkata",
					},
				},
			},
		});
		const membersCount = await ProjectModel.aggregate(pipeline);

		const outBoundCallCount = await OutboundCallModel.aggregate([
			{
				$match: {
					is_deleted: false,
					user_id: userId,
					project_id: new Types.ObjectId(projectId),
					organization_id: organizationId,
				},
			},
			{
				$addFields: {
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$match: dateFilter,
			},
		]);

		const getSearchIndex = await SearchModel.aggregate([
			{
				$match: {
					project_id: new Types.ObjectId(projectId),
					organization_id: organizationId,
					user_id: userId,
				},
			},
			{
				$addFields: {
					data_source: "$jsonData.Select_Data_Source.data",
				},
			},
			{
				$unwind: {
					path: "$data_source",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$match: {
					"data_source.isSelected": true,
				},
			},
			{
				$project: {
					data_source_name: 1,
					data_source: 1,
					updatedAt: 1,
				},
			},
			{
				$group: {
					_id: "$_id",
					data_source_name: {
						$first: "$data_source_name",
					},
					updatedAt: {
						$first: "$updatedAt",
					},
					totalIndexs: {
						$count: {},
					},
				},
			},
			{
				$project: {
					_id: 0,
					data_source_name: 1,
					updatedAt: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					updatedAtTimeStamp: "$updatedAt",
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					totalIndexs: 1,
				},
			},
			{
				$match: dateFilter,
			},
			{
				$sort: {
					updatedAtTimeStamp: -1,
				},
			},
			{
				$facet: {
					total: [{ $count: "count" }],
					data: [{ $skip: +skip }, { $limit: +limit }],
				},
			},
		]);
		const totalTokenCount = getSearchIndex[0]?.total[0]?.count || 0;
		const getSearchIndexInfo = getSearchIndex[0]?.data || [];

		const getFlowInfo = await OrchestrateModel.aggregate([
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					author: userId,
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$addFields: {
					todayDate: {
						$dateToString: {
							date: "$$NOW",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					createdAtDate: {
						$dateToString: {
							date: "$createdAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: dateFilter,
			},
			{
				$facet: {
					total: [{ $count: "count" }],
					data: [
						{
							$match: {
								$expr: {
									$eq: ["$todayDate", "$createdAtDate"],
								},
							},
						},
					],
				},
			},
		]);

		const totalFlowcount = getFlowInfo[0]?.total[0]?.count || 0;
		const flows = getFlowInfo[0]?.data || [];

		const promptInfo = await PromptModel.aggregate([
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					author: userId,
					aiVoicePrompt: false,
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$addFields: {
					todayDate: {
						$dateToString: {
							date: "$$NOW",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					createdAtDate: {
						$dateToString: {
							date: "$createdAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: dateFilter,
			},
			{
				$facet: {
					total: [
						{
							$count: "count",
						},
					],
					data: [
						{
							$match: {
								$expr: {
									$eq: ["$todayDate", "$createdAtDate"],
								},
							},
						},
					],
				},
			},
		]);
		const totalPromptCount = promptInfo[0]?.total[0]?.count || 0;
		const prompts = promptInfo[0]?.data || [];

		const aiVoicePrompt = await PromptModel.aggregate([
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					author: userId,
					aiVoicePrompt: true,
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$addFields: {
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: dateFilter,
			},
		]);
		const totalAiPrompt = aiVoicePrompt.length;

		const userActivity = await LogsModel.aggregate([
			{
				$match: {
					user_id: userId,
				},
			},
			{
				$sort: {
					createdAt: 1,
				},
			},
			{
				$addFields: {
					updatedAtDate: {
						$dateToString: {
							date: "$updatedAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: dateFilter,
			},
			{
				$addFields: {
					createdAtDate: {
						$dateSubtract: {
							startDate: new Date(),
							unit: "month",
							amount: 9,
						},
					},
				},
			},
			{
				$addFields: {
					date: {
						$dateToString: {
							date: "$createdAtDate",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					createdAtDate: {
						$dateToString: {
							date: "$createdAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					monthIndex: {
						$dateToString: {
							date: "$createdAt",
							format: "%Y-%m",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: {
					createdAtDate: {
						$gt: "$date",
					},
				},
			},
			{
				$group: {
					_id: "$monthIndex",
					firstCreatedAt: {
						$first: "$createdAtDate",
					},
					count: {
						$count: {},
					},
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
		]);
		let monthsArray = Array.from({ length: 9 }, (_, i) =>
			moment()
				.subtract(9 - i - 1, "months")
				.format("YYYY-MM")
		);

		// Create an object to map available data
		let activityMap = new Map(
			userActivity.map((item) => [item._id, item.count])
		);

		// Generate final chart data with missing months set to 0
		const chartData = {
			labels: monthsArray.map((month) =>
				moment(month, "YYYY-MM").format("MMM")
			), // Convert to short month name
			datasets: {
				label: "Activity",
				data: monthsArray.map((month) => activityMap.get(month) || 0), // Get count or default to 0
			},
		};

		const start = moment.utc(startDate as string);
		const end = moment.utc(endDate as string);
		const isSameDay = start.isSame(end, "day");

		let partitions: string[] = [];
		let dateQuery = {};

		if (isSameDay) {
			for (let i = 0; i < 24; i++) {
				partitions.push(start.clone().add(i, "hours").format("HH"));
			}
			dateQuery = {
				$and: [
					{
						createdAtDate: {
							$eq: startDate,
						},
					},
				],
			};
		} else {
			const diffDays = end.diff(start, "days");
			const step = Math.ceil(diffDays / 9);
			for (let i = 0; i <= diffDays; i += step) {
				partitions.push(
					start.clone().add(i, "days").format("YYYY-MM-DD")
				);
			}
		}
		let pipeline2: any = [];
		pipeline2 = [
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId as string),
				},
			},
			{
				$match: tokenFilter,
			},
			{ $sort: { createdAt: 1 } },
			{
				$addFields: {
					partitionKey: isSameDay
						? {
								$dateToString: {
									date: "$createdAt",
									format: "%H",
									timezone: "Asia/Kolkata",
								},
						  }
						: {
								$dateToString: {
									date: "$createdAt",
									format: "%Y-%m-%d",
									timezone: "Asia/Kolkata",
								},
						  },
					createdAtDate: {
						$dateToString: {
							date: "$createdAt",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: dateQuery,
			},
			{
				$group: {
					_id: "$partitionKey",
					completion_tokens: { $sum: "$completion_tokens" },
					total_prompt_tokens: { $sum: "$total_prompt_tokens" },
				},
			},
			{ $sort: { _id: 1 } },
		];
		// console.log(JSON.stringify(pipeline2));
		const tokenInfo = await TokenModel.aggregate(pipeline2);
		// console.log(tokenInfo);

		const activityMapToken = new Map(
			tokenInfo.map((item) => [
				item._id,
				{
					completion_tokens: item.completion_tokens || 0,
					total_prompt_tokens: item.total_prompt_tokens || 0,
				},
			])
		);

		const gradientLineChartData = {
			labels: partitions,
			datasets: [
				{
					label: "Completion Tokens",
					color: "info",
					data: partitions.map(
						(p) => activityMapToken.get(p)?.completion_tokens ?? 0
					),
				},
				{
					label: "Prompt Tokens",
					color: "dark",
					data: partitions.map(
						(p) => activityMapToken.get(p)?.total_prompt_tokens ?? 0
					),
				},
			],
		};

		return res.status(200).json({
			data: {
				organizations: organizationCount.length,
				// projects: pojectCount.length,
				members: membersCount.length,
				outBoundCall: outBoundCallCount.length,
				"Data by Projects": getSearchIndexInfo,
				totalSearches: totalTokenCount,
				// "today's Flow": flows.length,
				Flows: totalFlowcount,
				// "today's Prompt": prompts.length,
				Prompts: totalPromptCount,
				// "today's AI Prompt": 1,
				"Ai-Voice Prompt": totalAiPrompt,
				chart: chartData,
				token: gradientLineChartData,
			},
		});
	} catch (error: any) {
		console.error("Error fetching file:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

