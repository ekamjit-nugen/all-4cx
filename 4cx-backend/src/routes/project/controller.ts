import { Request, Response } from "express";
import { Types } from "mongoose";
import { ProjectModel, TenantModel } from "../../core/data/models";
import { createErrorLog, createSuccessLog } from "../../utils/commonhelper";

export const checkTenantProjectExist = async (req: Request, res: Response) => {
	const logService = "PROJECT";
	const logType = "get_project";

	const { userId, organizationId } = req.params;
	try {
		let pipeline: any = [];
		if (!userId || userId == "undefined") {
			// return res.status(400).json({ error: "Invalid input in userId" });
			throw new Error("Invalid input in userId");
		}
		let tenantInfo = await TenantModel.findOne({
			clerk_id: userId,
			// isDeleted: false,
		});
		if (!tenantInfo) {
			// return res.status(401).json({ error: "Access denied." });
			throw new Error("Access denied");
		}
		pipeline = [
			{
				$match: {
					clerk_org_id: organizationId,
					is_deleted: false,
				},
			},
			{
				$unwind: {
					path: "$collaborators",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					$or: [
						{
							owner_id: userId,
							is_deleted: false,
						},
						{
							collaborators: userId,
							is_deleted: false,
						},
					],
				},
			},
			{
				$group: {
					_id: "$_id",
					title: {
						$first: "$title",
					},
					owner_id: {
						$first: "$owner_id",
					},
					clerk_org_id: {
						$first: "$clerk_org_id",
					},
					is_active: {
						$first: "$is_active",
					},
					is_deleted: {
						$first: "$is_deleted",
					},
				},
			},
		];
		// console.log(JSON.stringify(pipeline));
		let projectInfo = await ProjectModel.aggregate(pipeline);
		res.status(200).json({ data: projectInfo || [] });
		await createSuccessLog({
			organizationId,
			userId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			organizationId,
			userId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Invalid input in userId"){
			return res.status(400).json({error: error.message});
		}
		if(error.message == "Access denied"){
			return res.status(401).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const createTenantProject = async (req: Request, res: Response) => {
	const logService = "PROJECT";
	const logType = "create_project";

	const { title, userId, collaborators, orgId } = req.body;
	try {
		if (!title || !userId || !orgId) {
			return res.status(400).json({ error: "Invalid Input" });
		}
		let projectTitleExist = await ProjectModel.findOne({
			title: title,
			// owner_id: userId,
			clerk_org_id: orgId,
		});
		if (projectTitleExist) {
			// return res.status(400).json({ error: "project title already exist" });
			throw new Error("Project title already exist");
		}
		await ProjectModel.create({
			title: title,
			owner_id: userId,
			collaborators: collaborators,
			clerk_org_id: orgId,
		});
		res.status(200).json({ message: "Project is created successfully" });
		await createSuccessLog({
			userId,
			organizationId: orgId,
			service: logService,
			type: logType,
		});
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			userId,
			organizationId: orgId,
			service: logService,
			type: logType,
			message: `${error.message}`,
		});
		if(error.message == "Project title already exist"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const addCollaboratorsToProject = async (
	req: Request,
	res: Response
) => {
	const logService = "PROJECT";
	const logType = "add_project_collaborators";
	let { projectId, collaborators } = req.body;
	try {
		if (!projectId || !collaborators) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		await ProjectModel.updateOne(
			{
				_id: new Types.ObjectId(projectId),
				is_deleted: false,
			},
			{
				$set: {
					collaborators: collaborators,
				},
			}
		);
		res.status(200).json({ message: "Project updated successfully" });
		await createSuccessLog({
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
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getProjectDataById = async (req: Request, res: Response) => {
	const logService = "PROJECT";
	const logType = "get_project";
	let { projectId } = req.params;
	try {
		if (!projectId || projectId == "undefined") {
			// return res.status(400).json({ error: "ProjectId is invalid " });
			throw new Error("ProjectId is invalid");
		}
		let projectInfo = await ProjectModel.findOne({
			_id: new Types.ObjectId(projectId),
			is_deleted: false,
		});
		res.status(200).json({ projectInfo });
		await createSuccessLog({
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
		if(error.message == "ProjectId is invalid"){
			return res.status(400).json({error: error.message});
		}
		return res.status(500).json({ error: "Internal server error" });
	}
};
