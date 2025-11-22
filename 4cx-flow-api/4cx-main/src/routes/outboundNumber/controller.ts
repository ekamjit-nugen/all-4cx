import { Request, Response, NextFunction} from "express";
import { OutboundCallModel, outboundJobModel } from "../../core/data/models";
import { createErrorLog, createSuccessLog } from "../../utils/commonhelper";
import { Types } from "mongoose";
import { client } from "../../utils/redis/client"; 
import axios from "axios"; 

export const createOutboundJob = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "create_outbound_job";

	const { organizationId, projectId, userId } = req.params;
	const { outboundJobName, categoryTag, description, phoneNumber, aiVoicePromptId } = req.body;
	try {
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({ error: "Invalid input in params" });
		}

		if (!outboundJobName || !phoneNumber || !categoryTag || !aiVoicePromptId) {
			return res.status(400).json({ error: "Invalid input" });
		}
		let query = {
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
			job_name: outboundJobName,
			category_tag: categoryTag,
			description,
			phone_number: phoneNumber,
			ai_voice_prompt_id: aiVoicePromptId,
		};
		// console.log("query", query);
		await outboundJobModel.create(query);

		res.status(201).json({ message: "outbound job created successfully" });

		await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
		});
	} catch (error) {
		console.log(error);
		// if (error instanceof Error) {
		//   await createErrorLog({
		//     userId,
		//     projectId,
		//     service: logService,
		//     type: logType,
		//     message: error.message,
		//   });
		// }
		console.error("Error", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getOutboundJobs = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "get_outbound_job";

	const { organizationId, projectId, userId } = req.params;

	const { outboundJobId, limit = 10, skip= 0 } = req.query;

	try {
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({ error: "Invalid Input" });
		}
		let query = {};
		if (outboundJobId) {
			query = {
				_id: new Types.ObjectId(outboundJobId as string),
			};
		} else {
			query = {
				organization_id: organizationId,
				project_id: new Types.ObjectId(projectId),
				user_id: userId,
			};
		}
		let pipeline: any = [
			{
				$match: query,
			},
			{
				$project: {
					_id: 1,
					organizationId: "$organization_id",
					projectId: "$project_id",
					userId: "$user_id",
					outboundJobName: "$job_name",
					categoryTag: "$category_tag",
					description: 1,
					phoneNumber: "$phone_number",
					isActive: "$active",
					updatedAt: 1,
					aiVoicePromptId: "$ai_voice_prompt_id"
				},
			},
			{
				$lookup: {
				  from: "ai_voice_prompt",
				  localField: "aiVoicePromptId",
				  foreignField: "_id",
				  as: "aiPromptInfo"
				}
			},
			{
				$unwind: {
				  path: "$aiPromptInfo",
				  preserveNullAndEmptyArrays: true
				}
			},
			{
				$addFields: {
				  aiVoiceTitle: "$aiPromptInfo.prompt_title"
				}
			},
			{
				$facet: {
					data: [
						{ $skip: Number(skip) },
						{ $limit: Number(limit) },
					],
					count: [
						{ $count: "totalCount" }
					],
				}
			}
		]
		// console.log(JSON.stringify(pipeline));
		const dbResponse = await outboundJobModel.aggregate(pipeline);

		res.status(200).json({ data: dbResponse[0].data || [],
			totalCount: dbResponse[0]?.count[0]?.totalCount || 0,
		});

		await createSuccessLog({
			userId,
			projectId,
			service: logService,
			type: logType,
		});
	} catch (error) {
		if (error instanceof Error) {
			// // Log the error event
			await createErrorLog({
				userId,
				projectId,
				service: logService,
				type: logType,
				message: error.message,
			});

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

export const createOutboundCall = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "create_outbound_number";

	const { organizationId, projectId, userId, outboundJobId } = req.params;
	let { contactName, phoneNumber, category, description, scheduled } = req.body;

	try {
		if (!organizationId || !projectId || !userId) {
			return res
				.status(400)
				.json({
					error: "Missing required parameters: organizationId, projectId, or userId",
				});
		}

		if (
			!contactName ||
			!phoneNumber ||
			!category ||
			!description ||
			!scheduled
		) {
			return res.status(400).json({ error: "Invalid input" });
		}
		let query = {
			organization_id: organizationId,
			project_id: projectId,
			user_id: userId,
			outbound_job_id: outboundJobId,
			contact_name: contactName,
			phone_number: phoneNumber,
			category,
			description,
			scheduled,
		};
		// console.log("query", query);
		await OutboundCallModel.create(query);

		return res.status(201).json({
			message: "successfully saved the outbound call",
			success: true,
		});
	} catch (error) {
		if (error instanceof Error) {
			// // Log the error event
			await createErrorLog({
				userId,
				projectId,
				service: logService,
				type: logType,
				message: error.message,
			});

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

export const getOutboundCall = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "get_outbound_number";

	const { organizationId, projectId, userId, outboundJobId } = req.params;
	const { outboundCallId } = req.query;

	try {
		if (!organizationId || !projectId || !userId) {
			return res.status(400).json({ error: "Missing required parameters: organizationId, projectId, or userId"	});
		}
		let query = {};
		if (outboundCallId) {
			query = {
				_id: new Types.ObjectId(outboundCallId as string),
			};
		} else {
			query = {
				outbound_job_id: new Types.ObjectId(outboundJobId),
				organization_id: organizationId,
				project_id: new Types.ObjectId(projectId),
				user_id: userId,
				is_deleted: false,
			};
		}
		// console.log("query", query);
		const dbRespones = await OutboundCallModel.aggregate([
			{
				$match: query,
			},
			{
				$project: {
					_id: 1,
					organizationId: "$organization_id",
					projectId: "$project_id",
					userId: "$user_id",
					contactName: "$contact_name",
					phoneNumber: "$phone_number",
					category: 1,
					description: 1,
					scheduled: "$scheduled",
					isSelected: "$select",
					status: 1,
					isActive: "$active",
					outboundJobId: "$outbound_job_id",
					updatedAt: 1,
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
		]);

		return res.status(200).json({
			data: dbRespones || [],
		});
	} catch (error) {
		if (error instanceof Error) {
			// // Log the error event
			await createErrorLog({
				userId,
				projectId,
				service: logService,
				type: logType,
				message: error.message,
			});

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

export const editOutboundCall = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "edit_outbound_number";

	const { outboundCallId } = req.params;
	const { contactName, phoneNumber, category, description, scheduled } =
		req.body;

	try {
		if (
			!contactName ||
			!phoneNumber ||
			!category ||
			!description ||
			!scheduled
		) {
			return res.status(400).json({ error: "Invalid input" });
		}
		let query = {
			contact_name: contactName,
			phone_number: phoneNumber,
			category,
			description,
			scheduled,
		};
		if (!outboundCallId) {
			return res
				.status(400)
				.json({ error: "Invalid input in outboundCallId" });
		}

		await OutboundCallModel.findOneAndUpdate(
			{
				_id: outboundCallId,
			},
			query
		);

		return res.status(200).json({ message: "Data updated successfully" });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteOutboundCall = async (req: Request, res: Response) => {
	const logService = "OUTBOUND_CALL";
	const logType = "delete_outbound_number";

	const { outboundCallId } = req.params;
	try {
		if (!outboundCallId) {
			return res.status(400).json({ error: "Invalid input in outboundCallId" });
		}
		const outboundInfo = await OutboundCallModel.findOne({
			_id: outboundCallId,
		});

		if (!outboundInfo) {
			return res.status(404).json({ message: "Data not found" });
		}
		let status = !outboundInfo.is_deleted;

		await OutboundCallModel.findOneAndUpdate(
			{
				_id: outboundCallId,
			},
			{
				is_deleted: status,
			}
		);

		return res.status(200).json({ message: "Data updated successfully" });
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
};
 
export const getOutboundCallStatus = async ( req: Request, res: Response ) => {
	const logService = "OUTBOUND_CALL"; 
	const logType = "get_outbound_number_status"; 
	const { organizationId, projectId } = req.params;
	try { 
		// console.log("organizationId", organizationId);
		if ( !organizationId || !projectId ) {
			return res.status(400).json({ error: "Missing required parameters: organizationId, projectId" });
		};
		// console.log("organizationId", organizationId);
		let checkOutBoundCall = await OutboundCallModel.find({ 
			organization_id: organizationId, 
			project_id: projectId, 
			status: "In Progress", 
			is_deleted: false
		}); 
 
		if( checkOutBoundCall.length > 0 ) {
			// Connect to Redis
			await client.connect(); 
			// console.log("checkOutBoundCall", checkOutBoundCall);
			const promises = checkOutBoundCall.map( async (data) => { 
				// console.log("call_connection_id", data.call_connection_id);
				if ( data.call_connection_id) {
					let redisResponse: any = await client.get(`current_session_id:${data.call_connection_id}`); 
						if (!redisResponse ) {
							// let dataResponse = JSON.parse(redisResponse);
								await OutboundCallModel.findOneAndUpdate(
									{ call_connection_id: data.call_connection_id },
									{
										$set: {
											status: "Completed",
										}
									} 
								)
						}
				} 
			}); 
			// Wait for all promises to resolve
			await Promise.all(promises); 
			// console.log("redisResponse", redisResponse);	
			await client.disconnect(); 
 
		} 
 
		return res.status(200).json({ data: "Calls updated successfully" }); 
	} 
	catch (error: any) { 
		console.error("Error fetching outbound call:", error?.message);
		return res.status(500).json({ error: "Internal server error" }); //return error message
	} 
};
 
export const getOutboundCallCallId = async ( req: Request, res: Response ) => {
    const logService = "OUTBOUND_CALL";
	const logType = "get_outbound_number_call_id";
 
	const { outboundCallIds = [] , aiVoiceId} = req.body; 
 
    try { 
        if (!Array.isArray(outboundCallIds) || outboundCallIds.length == 0) { 
            return res.status(400).json({ error: "Invalid or empty outboundCallIds array" })
        } 
		// Connect to Redis
		await client.connect(); 
        const promises = outboundCallIds.map(async (callId: string) => { 
			// const outboundCallInfo = await OutboundCallModel.findOne({
			// 	_id: callId,
			// 	is_deleted: false,
			// });
			const outboundCallArr = await OutboundCallModel.aggregate([
					{
					  $match: {
						_id: new Types.ObjectId(callId),
						is_deleted: false
					  }
					},
					{
					  $lookup: {
						from: "outbound_job",
						localField: "outbound_job_id",
						foreignField: "_id",
						as: "outboundJobInfo"
					  }
					},
					{
					  $unwind: {
						path: "$outboundJobInfo",
						preserveNullAndEmptyArrays: true
					  }
					},
					{
					  $addFields: {
						aiVoicePromptId:
						  "$outboundJobInfo.ai_voice_prompt_id"
					  }
					},
					{
					  $lookup: {
						from: "ai_voice_prompt",
						localField: "aiVoicePromptId",
						foreignField: "_id",
						as: "aiPromptInfo"
					  }
					},
					{
					  $unwind: {
						path: "$aiPromptInfo",
						preserveNullAndEmptyArrays: false
					  }
					},
					{
					  $addFields: {
						promptText: "$aiPromptInfo.prompt_text"
					  }
					},
					{
					  $project: {
						outboundJobInfo: 0
					  }
					}
			]);
			if (outboundCallArr.length > 0) {
				let outboundCallInfo = outboundCallArr[0];
					try {  
							const dummyCallResponse = await axios.post(`https://tf-ai-aivoice-dev-api-webapp-stt.azurewebsites.net/api/initiateOutboundCall`, {
								"phone_number": outboundCallInfo.phone_number,
								"client_name": outboundCallInfo.contact_name,
								"prompt_text": outboundCallInfo.promptText,
								"aiVoiceId": aiVoiceId
							});
							let status = dummyCallResponse.data.call_status;
							if ( status == "Started") {
								status = "In Progress";
							}
							await OutboundCallModel.findOneAndUpdate(
								{ _id: callId },
								{
									$set: {
										status: status,
										call_connection_id: dummyCallResponse.data.call_connection_id,
									},
								}
							);
						} catch (error) {
							await OutboundCallModel.findOneAndUpdate(
								{ _id: callId },
								{ $set: { status: "Failed"} }
							);
						} 
                } 
        }); 
		// Wait for all promises to resolve
        await Promise.all(promises); 
 
		// Disconnect from Redis
		await client.disconnect(); 
 
		// Log the success event
		return res.status(200).json({ message: "Calls updated successfully" })	
 
    } catch (error: any) {
        console.log("Error fetching outbound call status: ",  error?.message);
		// Log the error event
		return res.status(500).json({ error: "Internal server error " });
    } 
}
