import { Schema, model } from "mongoose";
import { IOpenAiChatThread } from "../IOpenAiChatThread";

const ChatSchema = new Schema<IOpenAiChatThread>(
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
        user_name: {
            type: String
        },
        bookmarked: {
            type: Boolean,
            default: false,
        },
        persona_message: {
            type: String
        },
        persona_message_title: {
            type: String
        },
        extension: {
            type: []
        },
        type: {
            type: String,
            default: "CHAT_THREAD"
        },
        model: {
            type: String
        },
        temperature: {
            type: Number,
        },
        topP: {
            type: Number,
        },
        frequencyPenalty: {
            type: Number,
        },
        presencePenalty: {
            type: Number,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true, 
        },
        chat_thread_type: {
            type: String,
            enum: ["prompt", "orchestrate"],
            default: "prompt"
        },
        flowise_id: {
            type: String,
        }
	},
	{
		collection: "open_ai_chat_thread",
		timestamps: true,
	}
);

const OpenAiChatThread = model<IOpenAiChatThread>("open_ai_chat_thread", ChatSchema);

export default OpenAiChatThread;
