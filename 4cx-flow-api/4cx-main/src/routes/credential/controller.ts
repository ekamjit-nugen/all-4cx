import { Request, Response } from "express";
import { CredentialModel } from "../../core/data/models";
import axios from "axios";
import { AuthenticatedRequest } from "../../middleware/auth";

export const saveCredentials = async (req: Request, res: Response) => {
	try {
		let { organizationId, projectId, userId, credentialId, credentialName, name } = req.body;

		// if( !projectId || !credentialId) {
		//     return res.status(400).json({ error: "Invalid input"});
		// }

		await CredentialModel.create({
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
			credential_id: credentialId,
			credential_name: credentialName,
			name: name,
		});

		return res
			.status(200)
			.json({ message: "Credential saved successfully." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getCredentialsById = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { organizationId, projectId } = req.params;
		const { credentialName } = req.query;
		const { clerk_id } = req.userInfo;

		if (!projectId || !organizationId || !credentialName) {
			return res.status(400).json({ error: "Invalid input" });
		}

		let pipeline: any;
		pipeline = [
			{
				$match: {
					// organization_id: organizationId,
                    // project_id: new Types.ObjectId(projectId),
					credential_name: credentialName,
					user_id: clerk_id,
				},
			},
			{
				$match: {
					$and: [
						{
							credential_id: {
								$ne: "",
							},
						},
						{
							credential_id: {
								$ne: null,
							},
						},
					],
				},
			},
		];
		const dataInfo = await CredentialModel.aggregate(pipeline);
		if (dataInfo.length == 0) {
			return res.status(200).json({ data: [] });
		}
		const dbResponse = await Promise.all(
			dataInfo.map(async (element) => {
				if (!element.credential_id) return null; // Skip if no flowwise_id

				try {
					 console.log(`${process.env.API_BASE_URL_4CX_FLOW}/credentials/${element.credential_id}`);
					const response = await axios.get(
						`${process.env.API_BASE_URL_4CX_FLOW}/credentials/${element.credential_id}`,
						{
							headers: { "x-request-from": "internal" },
						}
					);
					console.log(response.data);
					return response.data;
				} catch (error: any) {
					return null;
				}
			})
		);
		const filteredResponse = dbResponse.filter(Boolean);

		res.status(200).json({data: filteredResponse});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
