import moment from "moment";
import "moment-timezone";
import { OutboundCallModel } from "../../core/data/models";

export const getsechedulCalls = async () => {
	try {
		const pipeline: any = [
			{
				$match: {
					is_deleted: false,
					status: "Not Started",
				},
			},
			{
				$sort: {
					updatedAt: -1,
				},
			},
			{
				$addFields: {
					newDate: {
						$dateToString: {
							date: "$$NOW",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
					scheduledCallDate: {
						$dateToString: {
							date: "$scheduled",
							format: "%Y-%m-%d",
							timezone: "Asia/Kolkata",
						},
					},
				},
			},
			{
				$match: {
					$expr: {
						$eq: ["$newDate", "$scheduledCallDate"],
					},
				},
			},
		];
		const data = await OutboundCallModel.aggregate(pipeline);
		if (data.length > 0) {
			data.forEach(async (ele) => {
				if (ele.scheduled) {
					let scheduledCallTimeIST = moment(ele.scheduled).tz(
						"Asia/Kolkata"
					);
					const currentIST = moment().tz("Asia/Kolkata");
					const callTime = currentIST.diff(
						scheduledCallTimeIST,
						"minutes"
					);
					console.log("callTime", "callTime", callTime);
					console.log(ele);
					if (callTime <= 15) {
							// Update the status to "In Progress"
						await OutboundCallModel.updateOne(
							{ _id: ele._id },
							{ $set: { status: "In Progress" } }
						);
					}
						
				}
			});
		}
		return data;
	} catch (error) {
		console.log(error);
	}
};
