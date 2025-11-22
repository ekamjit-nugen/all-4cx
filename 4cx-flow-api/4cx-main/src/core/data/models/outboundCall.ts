import { model, Schema } from "mongoose";
import { IOuterboundCalls } from "../IOutboundCall";

const outboundNumberSchema = new Schema<IOuterboundCalls>(
	{
		project_id: { type: Schema.ObjectId, required: true },
		organization_id: { type: String, required: true },
		user_id: { type: String, required: true },
		outbound_job_id: { type: Schema.ObjectId, required: true },
		select: { type: Boolean, default: false },
		contact_name: { type: String },
		phone_number: { type: String },
		category: { type: String },
		description: { type: String },
		scheduled: { type: Date },
		call_length: { type: String },
		call_connection_id: { type: String },
		status: { type: String, default: "Not Started"},
		is_active: { type: Boolean, default: true },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		collection: "outbound_calls",
	}
);

const OutboundCallModel = model("outbound_calls", outboundNumberSchema);

export default OutboundCallModel;
