import { Request, Response } from "express";
import { DataModel } from "../../core/data/models";
import mongoose, { Schema, Types } from "mongoose";
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

export interface CustomRequest extends Request {
	file: any;
	userInfo: any;
}

export const getSourceData = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "SOURCE_DATA";
	const logType = "get_user_data";
	const { userId, data_type = "", source_type, projectId, limit = 10, skip = 0 } = req.body;

	if (!userId || !projectId) {
		throw new Error("Invalid input");
	}

	try {
		let query = {
			clerk_id: userId,
			source_type: source_type,
			project_id: new Types.ObjectId(projectId),
			is_deleted: false,
		};
		let pipeline: any = [];

		// Shared $match stage
		pipeline.push({ $match: query });

		// Folder-specific pipeline stages
		if (data_type === "folder") {
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

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Progress",
		});

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
		if (error.message === "Invalid input in url") {
			return res.status(400).json({ error: error.message });
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

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Progress",
		});

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
		if( error.message == "Invalid Input") {
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

		createNotificationLog({
			event: event,
			userId: clerk_id,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Progress",
		});

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
