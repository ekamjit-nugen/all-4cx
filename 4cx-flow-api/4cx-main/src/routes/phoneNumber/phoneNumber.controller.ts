import { Request, Response } from "express";
import PhoneNumber from "../../core/data/models/phoneNumber";
import { IPhoneNumber } from "../../core/data/IPhoneNumber";
import { createErrorLog, createSuccessLog } from "../../utils/commonhelper";
import {
	getPurchasedPhoneNumber,
	releasePhoneNumber,
} from "./phoneNumber.services";

export const createPhoneNumber = async (req: Request, res: Response) => {
	const logService = "PHONE";
	const logType = "create_widget_configuration";

	const { organizationId, projectId, userId } = req.params;
	let { phoneNumberName, category, region, description, status } = req.body;

	try {
		// Validate required parameters
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({
				error: "Missing required parameters: organizationId, projectId, or userId",
			});
		}

		const newPhoneNumber: IPhoneNumber = new PhoneNumber({
			phoneNumberName,
			category,
			region,
			description,
			status,
			project_id: projectId,
			user_id: userId,
			organization_id: organizationId,
		});

		// console.log("CHECK ===========> ", {
		//   phoneNumberName,
		//   phoneNumber,
		//   category,
		//   region,
		//   description,
		//   status,
		//   project_id: projectId,
		//   user_id: userId,
		//   organization_id: organizationId
		// })

		// Save the widget configuration to the database
		await newPhoneNumber.save();
		// Create a new widget configuration

		// Log success event
		await createSuccessLog({
			userId,
			service: logService,
			type: logType,
			projectId,
		});

		// Return success response
		return res.status(201).json({
			message: "Phone number saved successfully",
			success: true,
			statusCode: 201,
			data: newPhoneNumber,
		});
	} catch (error) {
		if (error instanceof Error) {
			// // Log the error event
			// await createErrorLog({
			//   userId,
			//   projectId,
			//   service: logService,
			//   type: logType,
			//   message: error.message,
			// });

			console.error("Error", error);

			// Return appropriate error response
			if (error.message === "Invalid input") {
				return res.status(400).json({ error: error.message });
			}

			return res.status(500).json({ error: "Internal server error" });
		}

		// Handle unexpected errors that aren't instances of Error
		return res.status(500).json({ error: "An unexpected error occurred" });
	}
};

export const getPhoneNumbers = async (req: Request, res: Response) => {
	const logService = "PHONE";
	const logType = "get_phone_numbers";

	const { organizationId, projectId, userId } = req.params;
	const { phoneNumberId, limit = 10, skip = 0 } = req.query; // Query parameter for single phone number

	try {
		// Validate required parameters
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({
				error: "Missing required parameters: organizationId, projectId, or userId",
			});
		}

		let phoneNumbers;

		if (phoneNumberId) {
			// Fetch a single phone number if phoneNumberId is provided
			phoneNumbers = await PhoneNumber.findById(phoneNumberId);

			if (!phoneNumbers) {
				return res.status(404).json({
					message: "Phone number not found",
					success: false,
					statusCode: 404,
				});
			}
		} else {
			// Fetch all phone numbers for the given organization, project, and user
			phoneNumbers = await PhoneNumber.aggregate([
				{
					$match: {
						organization_id: organizationId,
						project_id: projectId,
						user_id: userId,
					},
				},
				{
					$sort: {
						updatedAt: -1,
					},
				},
				{
					$facet: {
						data: [{ $skip: +skip }, { $limit: +limit }],
						total: [{ $count: "count" }],
					},
				},
			]);

			// if (!phoneNumbers.length) {
			//   return res.status(200).json({
			//     message: "No phone numbers found",
			//     success: false,
			//     statusCode: 404,
			//   });
			// }
		}

		// Log success event
		await createSuccessLog({
			userId,
			service: logService,
			type: logType,
			projectId,
		});

		return res.status(200).json({
			message: "Phone numbers retrieved successfully",
			success: true,
			statusCode: 200,
			data: phoneNumberId ? phoneNumbers : phoneNumbers[0]?.data || [],
			total: phoneNumberId ? "1" : phoneNumbers[0]?.total[0]?.count || 0,
		});
	} catch (error) {
		if (error instanceof Error) {
			// Log the error event
			console.error("Error", error);

			// Return appropriate error response
			return res.status(500).json({ error: "Internal server error" });
		}

		// Handle unexpected errors that aren't instances of Error
		return res.status(500).json({ error: "An unexpected error occurred" });
	}
};

export const releasePhoneNumbers = async (req: Request, res: Response) => {
	const logService = "PHONE";
	const logType = "release_phone_numbers";

	const { organizationId, projectId, userId } = req.params;
	const { phoneNumberId } = req.query;

	try {
		// Validate required parameters
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({
				success: false,
				message:
					"Missing required parameters: organizationId, projectId, or userId",
				statusCode: 400,
			});
		}

		if (!phoneNumberId) {
			return res.status(400).json({
				success: false,
				message: "Missing required query parameter: phoneNumberId",
				statusCode: 400,
			});
		}

		const phoneInfo = await PhoneNumber.findOne({
			_id: phoneNumberId,
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
		});

		if (!phoneInfo) {
			return res.status(404).json({ error: "Phone number not found" });
		}
		await releasePhoneNumber(phoneInfo.phoneNumber);
		// Update the phone number status to "Released"
		const phoneNumberInstance = await PhoneNumber.findByIdAndUpdate(
			phoneNumberId,
			{ status: "Released" },
			{ new: true } // Return the updated document
		);

		if (!phoneNumberInstance) {
			return res.status(404).json({
				success: false,
				message: "No phone number found with the provided ID",
				statusCode: 404,
			});
		}

		// Log success event
		await createSuccessLog({
			userId,
			service: logService,
			type: logType,
			projectId,
		});

		// Return success response
		return res.status(200).json({
			success: true,
			message: "Phone number released successfully",
			statusCode: 200,
			data: phoneNumberInstance, // Include the updated phone number if needed
		});
	} catch (error) {
		if (error instanceof Error) {
			// Log the error event
			console.error("Error", error);

			// Return appropriate error response
			return res.status(500).json({ error: "Internal server error" });
		}

		// Handle unexpected errors that aren't instances of Error
		return res.status(500).json({ error: "An unexpected error occurred" });
	}
};

export const purchasePhoneNumber = async (req: Request, res: Response) => {
	const logService = "PHONE";
	const logType = "purchase_phone_numbers";

	const { organizationId, projectId, userId } = req.params;
	const { phoneNumberId } = req.query;
	const { region = "GB" } = req.body;

	try {
		// Validate required parameters
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({
				success: false,
				message:
					"Missing required parameters: organizationId, projectId, or userId",
				statusCode: 400,
			});
		}

		if (!phoneNumberId) {
			return res.status(400).json({
				success: false,
				message: "Missing required query parameter: phoneNumberId",
				statusCode: 400,
			});
		}

		const phoneInfo = await PhoneNumber.findOne({
			_id: phoneNumberId,
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
		});

		if (!phoneInfo) {
			return res.status(404).json({ error: "Phone number not found" });
		}

		const phoneNumber = await getPurchasedPhoneNumber(region);

		await PhoneNumber.findOneAndUpdate(
			{
				_id: phoneNumberId,
			},
			{
				$set: {
					phoneNumber: phoneNumber,
					status: "Active",
					region: region,
				},
			}
		);

		await createSuccessLog({
			userId,
			service: logService,
			type: logType,
			projectId,
		});

		// Return success response
		return res.status(200).json({
			success: true,
			message: "Phone number purchased successfully",
			statusCode: 200,
			// data: phoneNumberInstance, // Include the updated phone number if needed
		});
	} catch (error) {
		if (error instanceof Error) {
			// Log the error event
			console.error("Error", error);

			// Return appropriate error response
			return res.status(500).json({ error: "Internal server error" });
		}

		// Handle unexpected errors that aren't instances of Error
		return res.status(500).json({ error: "An unexpected error occurred" });
	}
};
