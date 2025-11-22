import { Schema, model } from "mongoose";
import { IOpenAiChat } from "../IOpenAiChat";

const ChatSchema = new Schema<IOpenAiChat>(
	{
        organization_id: {
            type: String,
        },
        project_id: {
            type: Schema.Types.ObjectId,
        },
        name: {
            type: String,
        },
        user_id: {
            type: String,
        },
        content: {
            type: String,
        },
        multi_modal_image: {
            type: String,
        },
        role: {
            type: String,
        },
        thread_id: {
            type: Schema.Types.ObjectId,
        },
        type: {
            type: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: false,   
        }
	},
	{
		collection: "open_ai",
		timestamps: true,
	}
);

const openAiChat = model<IOpenAiChat>("open_ai", ChatSchema);

export default openAiChat;
