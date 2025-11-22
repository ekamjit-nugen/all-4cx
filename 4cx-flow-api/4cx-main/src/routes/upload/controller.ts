import { Request, Response } from "express";
import {
	getAzureMetaData,
	updateAzureMetaData,
	uploadFileToAzure,
} from "../../utils/upload";
import {
	DataModel,
	LogsModel,
	RootFolderModel,
	TenantModel,
} from "../../core/data/models";
import { Types } from "mongoose";
import {
	createErrorLog,
	createNotificationLog,
	createSuccessLog,
	downloadFile,
	getBlobName,
	getFileName,
	getUrlCount,
	getUrlDomainName,
	scrapUrl,
} from "../../utils/commonhelper";
import { kafkaProducer } from "../../utils/kafka/producer";
export interface CustomRequest extends Request {
	files: Array<any>;
	file: any;
	tenantId: Types.ObjectId;
	sourceType: string;
	source: string;
	projectId: Types.ObjectId;
	userInfo: any;
}

export const uploadLocalSourceData = async (
	req: CustomRequest,
	res: Response
) => {
	const logService = "DATA_UPLOAD";
	const logType = "local_source_data";
	const event = "notification";

	const { userId, organizationId,  projectId, sourceType = "local", folderName } = req.body;

	if (!userId || !projectId) {
		throw new Error("Invalid Input");
	}
	if (!req.files) {
		throw new Error("please attach files");
	}
	try {
		let tenantInfo = await TenantModel.findOne({
			clerk_id: userId,
			// isDeleted: false,
			// isActive: true,
		});

		if (!tenantInfo) {
			// return res.status(403).json({ error: "Access denied." });
			throw new Error("Access denied");
		}
		let originalName = "";
		let url = "";
		let rootFolderId: any = "";

		if (folderName) {
			let RootFolderInfo = await RootFolderModel.create({
				file_name: folderName,
				project_id: projectId,
			});
			rootFolderId = RootFolderInfo._id;
		}
		res.status(200).json({
			message: "file uploaded successfully",
		});

		// createNotificationLog({
		// 	event: event,
		// 	userId: userId,
		// 	organizationId: organizationId,
		// 	title: logType,
		// 	projectId: projectId,
		// 	service: logService,
		// 	status: "Progress"
		// });

		req.files.forEach(async ({ path, originalname }) => {
			path ? path : "";
			if (folderName) {
				originalName = `${userId}/${projectId}/${sourceType}/${folderName}/${originalname}`;
			} else {
				originalName = `${userId}/${projectId}/${sourceType}/${originalname}`;
			}

			url = await uploadFileToAzure(path, originalName);
			let checkDataExist = await DataModel.findOne({
				url: url,
			});
			if (checkDataExist) {
				let dataSourceId = checkDataExist._id;

				let blobName: any = await getBlobName(url);
				let azureMetaData: any = await getAzureMetaData(blobName);
				let count = azureMetaData.update_count;
				// console.log(Number(count));

				let num = Number(count);
				let increment = ++num;

				let metaData = {
					is_deleted: "false",
					upload_count: increment.toString(),
				};

				await updateAzureMetaData(metaData, blobName);
				await DataModel.updateOne(
					{ _id: dataSourceId },
					{
						$set: {
							update_count: num,
						},
					}
				);
			} else {
				let dataQuery: any = {
					file_name: folderName
						? `${folderName}/${originalname}`
						: `${originalname}`,
					clerk_id: userId,
					data_type: folderName ? "folder" : "file",
					project_id: projectId,
					url: url,
					source_type: sourceType,
					component: "",
					data_retention_policy: "",
					encryption_enabled: false,
					is_active: false,
					origin: folderName ? "folder" : "file",
				};
				if (folderName) {
					dataQuery.root_folder_id = rootFolderId;
					console.log(dataQuery);
					await DataModel.create(dataQuery);
				} else {
					await DataModel.create(dataQuery);
				}
			}

			let logsQuery = {
				clerk_id: userId,
				username: tenantInfo.username,
				role_id: tenantInfo.role_id,
				email: tenantInfo.email,
				activity: "Uploading file",
			};
			await LogsModel.create(logsQuery);
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Completed"
		});

		await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
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

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed"
		});

		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "please attach files"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Access denied"){
			return res.status(403).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const updateLocalSourceData = async (
	req: CustomRequest,
	res: Response
) => {
	const logService = "DATA_UPLOAD";
	const logType = "update_local_source_data";

	// let { clerk_id } = req.userInfo;

	let {
		dataSourceId,
		userId,
		projectId,
		sourceType = "local",
		component,
		data_retention_policy,
		encryption_enabled,
		folderName,
	} = req.body;
	try {
		if (!dataSourceId || !userId || !projectId) {
			throw new Error("Invalid input");
		}
		let tenantInfo = await TenantModel.findOne({
			clerk_id: userId,
		});
		let dataSourceInfo = await DataModel.findOne({
			_id: dataSourceId,
		});
		if (!dataSourceInfo) {
			throw new Error("Source data does't exist");
		}
		if (!tenantInfo) {
			throw new Error("Access denied");
		}
		let originalName = "";
		let url = "";
		res.status(200).json({
			message: "file updated successfully",
		});
		if (req.file) {
			let path = req.file.path;
			let originalname = req.file.originalname;
			if (folderName) {
				originalName = `${userId}/${projectId}/${sourceType}/${folderName}/${originalname}`;
			} else {
				originalName = `${userId}/${projectId}/${sourceType}/${originalname}`;
			}
			console.log(path, originalname);
			url = await uploadFileToAzure(path, originalName);
			let checkUrlPreviousExisted = await DataModel.findOne({
				url: url,
			});

			let updateDataQuery = {
				file_name: folderName
					? `${folderName}/${originalname}`
					: `${originalname}`,
				clerk_id: userId,
				data_type: folderName ? "folder" : "file",
				project_id: projectId,
				url: url,
				source_type: sourceType,
				component: component,
				update_count: dataSourceInfo.update_count.toString(),
				// data_retention_policy: data_retention_policy,
				// encryption_enabled: encryption_enabled,
			};

			if (checkUrlPreviousExisted) {
				let updatedCount = checkUrlPreviousExisted.update_count;
				let num = Number(updatedCount);
				let increment = ++num;
				updateDataQuery.update_count = increment.toString();
				await DataModel.updateOne(
					{ _id: new Types.ObjectId(dataSourceId) },
					updateDataQuery
				);
			}
			await DataModel.updateOne(
				{ _id: new Types.ObjectId(dataSourceId) },
				updateDataQuery
			);
		} else {
			await DataModel.updateOne(
				{
					_id: new Types.ObjectId(dataSourceId),
				},
				{
					source_type: sourceType,
					component: component,
					// data_retention_policy: data_retention_policy,
					// encryption_enabled: encryption_enabled,
				}
			);
		}
		// let logsQuery = {
		// 	clerk_id: userId,
		// 	username: tenantInfo.username,
		// 	role_id: tenantInfo.role_id,
		// 	email: tenantInfo.email,
		// 	activity: "updated file",
		// };
		// await LogsModel.create(logsQuery);
		await createSuccessLog({
			userId,
			dataSourceId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			userId,
			dataSourceId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Source data does't exist"){
			return res.status(404).json({error: error.message});
		}
		if(error.message == "Access denied"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const uploadWebsiteSourceData = async (req: CustomRequest, res: Response) => {
	const logService = "DATA_UPLOAD";
	const logType = "scraping_web_source_data";
	const event = "notification";

	const { url: rawUrl, userId, component, projectId, organizationId } = req.body;
	try {
		const sourceType = "website";

		if (
			!userId ||
			!projectId ||
			!Array.isArray(rawUrl) ||
			rawUrl.length === 0
		) {
			throw new Error("Invalid input");
		}

		let count = 0;
		res.status(200).json({
			message: "Web URL extraction started",
			count: rawUrl.length,
		});
		
		// createNotificationLog({
		// 	event: event,
		// 	userId: userId,
		// 	organizationId: organizationId,
		// 	title: logType,
		// 	projectId: projectId,
		// 	service: logService,
		// 	status: "Progress"
		// });

		let sitemap = false;
		for (const newUrl of rawUrl) {
			const domain_name = getUrlDomainName(newUrl);
			if (newUrl.endsWith("sitemap.xml")) {
				const urls: any = await getUrlCount(newUrl);
				await kafkaProducer(
					userId,
					projectId,
					organizationId,
					sourceType,
					domain_name,
					urls,
				);
				sitemap = true;
			} else {
				let url = "";
				if (newUrl.endsWith("/")) {
					url = newUrl.split("/").slice(0, -1).join("/");
				} else {
					url = newUrl;
				}
				console.log(url);
				let path: any = "";
				const logsData = await LogsModel.create({
					clerk_id: userId,
					project_id: projectId,
					url: url,
					key: "",
					activity: "Web-url scraping",
					status: "PENDING",
				});
				const logId = logsData._id;
				let fileName = await getFileName(url);
				const originalname = `${userId}/${projectId}/${sourceType}/${fileName}.html`;
				if (url.endsWith(".pdf")) {
					path = await downloadFile(url, logId);
					// path = await downloadFile(url);
				} else {
					path = await scrapUrl(url, logId, domain_name);
					// path = await scrapUrl(url, domain_name);
				}

				const uploadedUrl = await uploadFileToAzure(path, originalname);

				let checkDataExist = await DataModel.findOne({
					file_name: fileName,
					clerk_id: userId,
					project_id: projectId,
					is_deleted: false,
				});
				if (!checkDataExist) {
					await DataModel.create({
						file_name: fileName,
						clerk_id: userId,
						project_id: projectId,
						url: uploadedUrl,
						source_type: sourceType,
						component: component,
						data_retention_policy: "",
						encryption_enabled: false,
						data_type: "file",
						update_count: "1",
						origin: "Website",
					});
					// console.log("DONE");
				} else {
					let dataId = checkDataExist._id;
					let updatedCount = checkDataExist.update_count;

					let blobName: any = await getBlobName(uploadedUrl);
					let num = Number(updatedCount);
					let increment = ++num;
					let metaData = {
						is_deleted: "false",
						upload_count: increment.toString(),
					};

					await updateAzureMetaData(metaData, blobName);
					await DataModel.updateOne(
						{
							_id: dataId,
						},
						{
							url: uploadedUrl,
							data_type: "file",
							update_count: increment.toString(),
						}
					);
				}
				await LogsModel.updateOne(
					{ _id: logId },
					{
						url: url,
						key: uploadedUrl,
						status: "COMPLETED",
					}
				);
				let logData = await LogsModel.findOne({ _id: logId });

				count++;

				global.io.emit("url-scraping", {
					processed: count,
					total: rawUrl.length,
					data: logData,
				});
			}
		}

		if(!sitemap) {
			createNotificationLog({
				event: event,
				userId: userId,
				organizationId: organizationId,
				title: logType,
				projectId: projectId,
				service: logService,
				status: "Completed"
			});
		}
	} catch (error: any) {
		console.error(error);
		await createErrorLog({
			userId,
			projectId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Failed"
		});

		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		res.status(500).json({ error: "Internal server error" });
	}
};
