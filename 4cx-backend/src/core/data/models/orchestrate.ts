import { Schema, model } from "mongoose";
import { IOrchestrate } from "../IOrchestrate";

const orchestrateSchema = new Schema<IOrchestrate>(
	{
		flow_name: {
			type: String,
			required: true,
		},
		organization_id: {
			type: String,
		},
		project_id: {
			type: Schema.Types.ObjectId,
		},
        prompt_id: {
            type:  Schema.Types.ObjectId,
            required: true,
        },
		author: {
			type: String,
		},
		prompt_version: {
			type: Number,
			// required: true,
		},
		version: {
			type: Number,
			default: 1,
			// required: true,
		},
		run: {
			type: Number,
			default: 0
		},
		json_prompt_flow: {
			type: {},
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		is_deleted: {
			type: Boolean,
			default: false,
		},
		category: {
			type: String,
		},
		archive_status:{
			type: Boolean,
			default: false
		}
	},
	{
        collection: "orchestrate",
        timestamps: true
    }
);

const orchestrateFlow = model("orchestrate", orchestrateSchema);

export default orchestrateFlow;


