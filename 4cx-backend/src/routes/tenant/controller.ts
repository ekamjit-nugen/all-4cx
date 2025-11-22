import { Request, Response } from "express";
import {
	LogsModel,
	OrganizationModel,
	TenantModel,
} from "../../core/data/models";
import axios from "axios";
import EnvManager from "../../core/EnvManager";
import { createSuccessLog, createErrorLog } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";
 
const accessToken = EnvManager.getClerkSecretKey();
 
export const addTenant = async (req: Request, res: Response) => {
	const logType = "create_tenant";
	const logService = "USER";

	let { userId } = req.body;
	// let accessToken = EnvManager.getClerkSecretKey();
	if (!userId) {
		// return res.status(400).json({ error: "Invalid input in userId" });
		throw new Error("Invalid input in userId");
	}
	try {
		let tenantExist = await TenantModel.findOne({
			clerk_id: userId,
			// is_deleted: false,
		});
		let tenantInfo: any = {};
		tenantInfo = tenantExist;
		if (!tenantExist) {
			try {
				let tenantInfo = await fetchUserData(userId, accessToken);
				if (tenantInfo) {
					let tenantEmails = tenantInfo.email_addresses;
					let tenantEmail = tenantEmails[0].email_address;

					await TenantModel.create({
						clerk_id: userId,
						username: tenantInfo.username || tenantEmail,
						email: tenantEmail,
					});
					await createSuccessLog({
						email: tenantEmail,
						userId: userId,
						service: logService,
						type: logType,
					});
				}
			} catch (error: any) {
				throw new Error();
			}
		}
		res.status(200).json({ status: "success", tenantInfo });
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			userId: userId,
			service: logService,
			type: logType,
			message: `${error.message}`
		});
		if(error.message == "Invalid input"){
			return res.status(400).json({error: error.message});
		}
		return res.status(200).json({ error: "Internal server error" });
	}
};
 
export const addTenantOrganizationData = async (req: Request, res: Response) => {
	const logType = "create_organization";
	const logService = "ORGANIZATION";

	try {
		let { userId, orgId } = req.body;
		if (!userId || !orgId) {
			// return res.status(400).json({ error: "Invalid input" });
			throw new Error("Invalid input");
		}
		let tenantExist = await TenantModel.findOne({
			clerk_id: userId,
		});
		if (!tenantExist) {
			// return res.status(401).json({ error: "access denied" });
			throw new Error("Access denied");
		}
		let orgInfo:any = {};
		try {
			let clerkOrgData = await fetchTenantOrgData(orgId, accessToken);
			if (clerkOrgData) {
				orgInfo = await OrganizationModel.findOne({
					clerk_org_id: orgId,
				});
				if (!orgInfo) {
					await OrganizationModel.create({
						org_name: clerkOrgData.name,
						clerk_org_id: orgId,
						slug: clerkOrgData.slug,
						createdBy: clerkOrgData.created_by,
					});
					await createSuccessLog({
						userId: userId,
						organizationId: orgId,
						service: logService,
						type: logType,
					})
				}
			}
		} catch (error :any) {
			await createErrorLog({
				userId: userId,
				organizationId: orgId,
				service: logService,
				type: logType,
				message: `${error.message}`
			})
			if(error.message == "Invalid input"){
				return res.status(400).json({error: error.message});
			}
			if(error.message == "Access denied"){
				return res.status(400).json({error: error.message});
			}
			throw new Error();
		}
		res.status(200).json({ status: "success", orgInfo: orgInfo || {} });
	} catch (error: any) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
 
export const getTenantOrgMembers = async (req: AuthenticatedRequest, res: Response) => {
	const logService = "ORGANIZATION";
	const logType = "get_organization_member";
	
	// let { clerk_id } = req.userInfo;

	let { orgId } = req.params;
	if (!orgId) {
		// return res.status(400).json({ error: "Invalid Input" });
		throw new Error("Invalid input");
	}
	try {
		let clerkOrgMembers = await fetchTenantOrgMemberData(
			orgId,
			accessToken
		);
		let orgMemberData = clerkOrgMembers.data;
		res.status(200).json({
			data: orgMemberData || [],
			total_count: clerkOrgMembers.total_count,
		});
		await createSuccessLog({
			// userId: clerk_id,
			organizationId: orgId,
			service: logService,
			type: logType,
		});
		
	} catch (error: any) {
		console.log(error);
		await createErrorLog({
			// userId: clerk_id,
			organizationId: orgId,
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
 
async function fetchUserData(userId: string, accessToken: string) {
	const url = `https://api.clerk.com/v1/users/${userId}`;
 
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}
async function fetchTenantOrgData(orgId: string, accessToken: string) {
	const url = `https://api.clerk.com/v1/organizations/${orgId}`;
 
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}
async function fetchTenantOrgMemberData(orgId: string, accessToken: string) {
	const url = `https://api.clerk.com/v1/organizations/${orgId}/memberships`;
 
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
}
 