import { Request, Response } from "express";
import { NotificationModel } from "../../core/data/models";
import { createErrorLog, createSuccessLog } from "../../utils/commonhelper";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/auth";

export const getAllNotification = async (req: Request, res: Response) => {
	let logService = "NOTIFICATION";
	let logType = "get_all_notification";

	let { organizationId, projectId, userId } = req.params;
	try {
		if( !organizationId || !projectId || !userId ){
			throw new Error("Invalid input");
		}
		let pipeline: any = [
			{
				$match: {
					organization_id: organizationId,
					project_id: new Types.ObjectId(projectId),
					user_id: userId,
					is_deleted: false,
				}
			},
			{
				$sort: {
					updatedAt: -1
				}
			}
		];
		let notInfo = await NotificationModel.aggregate(pipeline);
		res.status(200).json({ data: notInfo });
		createSuccessLog({
			userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		createErrorLog({
			userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if(error.message == "Invalid input") {
			return res.status(400).json({ error: error.message});
		}
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const createNotification = async (req: Request, res: Response) => {
	let logService = "NOTIFICATION";
	let logType = "create_notifications";

	let { organizationId, projectId, userId } = req.params;
	try {
        let { title, service, status } = req.body;

        if( !organizationId || !projectId || !userId || !title || !service || !status) {
            throw new Error("Invalid input");
        }
        await NotificationModel.create({
            organization_id: organizationId,
            project_id: projectId,
            user_id: userId,
            title: title,
            service: service,
            status: status,
        });
		res.status(200).json({ message: "Data updated successfully" });
		createSuccessLog({
			userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error.message);

		createErrorLog({
			userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if( error.message = "Invalid input"){
			return res.status(400).json({ error: "Invalid input"});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const clearALLNotification = async (req: Request, res: Response) => {
	const logService = "NOTIFICATION";
	const logType = "clear_all_notifications";

	let { organizationId, projectId, userId } = req.params;
	try {
		if( !organizationId || !projectId || !userId ) {
            throw new Error("Invalid input");
        }
		await NotificationModel.updateMany(
			{
				is_deleted: false,
				organization_id: organizationId,
				project_id: projectId,
				user_id: userId,
			},
			{
				is_deleted: true,
			}
		);
		res.status(200).json({ message: "Data updated successfully" });
		createSuccessLog({
			userId,
			service: logService,
			type: logType,
		});

	} catch (error: any) {
		console.log(error);

		createErrorLog({
			userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});

		if( error.message = "Invalid input"){
			return res.status(400).json({ error: "Invalid input"});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const clearNotification = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "NOTIFICATION";
	const logType = "clear_single_notification";
	
	let { clerk_id } = req.userInfo;
	let { notificationId } = req.query;
	try {
		if (!notificationId) {
			throw new Error("Data not found");
		}

		let dataInfo = await NotificationModel.findOne({ 
			_id: notificationId, 
			is_deleted: false
		});

		if (!dataInfo) {
			throw new Error("Data not found");
		}
	
		await NotificationModel.updateOne(
			{
				_id: notificationId,
			},
			{
				is_deleted: true,
			}
		);
		res.status(200).json({ message: "Data updated successfully" });
		createSuccessLog({
			userId: clerk_id,
			service: logService,
			type: logType,
		})
	} catch (error: any) {
		console.log(error);
		
		createErrorLog({
			userId: clerk_id,
			service: logService,
			type: logType,
			message: `${error.message}`,
		})
		if( error.message = "Invalid input"){
			return res.status(400).json({ error: "Invalid input"});
		}
		if(error.message == "Data not found"){
			return res.status(404).json({ error: "Data not found"});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
