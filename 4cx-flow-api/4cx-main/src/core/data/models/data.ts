import { Schema, model, Types } from "mongoose";
import { IData } from "../IData";

const DataSchema = new Schema<IData>(
	{
		project_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		data_type: {
			type: String,
			// required: true
		},
		clerk_id: {
			type: String,
			required: true,
		},
		root_folder_id: {
			type: Schema.Types.ObjectId,
		},
		source_type: {
			type: String,
			// required: true
		},
		file_name: {
			type: String,
		},
		component: {
			type: String,
		},
		data_retention_policy: {
			type: String,
			// required: true
		},
		encryption_enabled: {
			type: Boolean,
			default: false,
		},
		update_count: {
			type: Number,
			default: 1,
		},
		origin: {
			type: String,
		},
		language: {
			type: String,
			default: "English" 
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		is_deleted: {
			type: Boolean,
			default: false,
		},
		url: {
			type: String,
            // required:true
		},
		data_config_name: {
			type: String,
		},
		description: {
			type: String,
		},
		server_certification_validation: {
			type: Boolean,
			default: false,
		},
		authentication_type: {
			type: String,
		},
		user_name: {
			type: String,
		},
		password: {
			type: String,
		},
		service: {
			type: String,
		},
	},
	{
		collection: "data",
		timestamps: true,
	}
);

const Data = model<IData>("data", DataSchema);

export default Data;
