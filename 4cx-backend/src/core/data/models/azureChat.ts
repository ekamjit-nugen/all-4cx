import { Schema, model } from "mongoose";
import { IAzureChat } from "../IAzureChat";

const ChatSchema = new Schema<IAzureChat>(
	{
		organization_id: {
            type: String,
        },
        project_id: {
            type: Schema.Types.ObjectId,
        },
        user_id: {
            type: String,
        },
		orchestrate_id: {
			type: Schema.Types.ObjectId,
		},
		content: {
			type: String,
		},
		role: {
			type: String,
		},
		chat_history: {
			type: {},
		},
		ai_model: {
			type: String,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		is_deleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		collection: "azure_chat",
		timestamps: true,
	}
);

const AzureChat = model<IAzureChat>("azure_chat", ChatSchema);

export default AzureChat;
