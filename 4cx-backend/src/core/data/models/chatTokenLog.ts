import { Schema, model, Document, Types } from 'mongoose';
import { IChatTokenLogs } from "../IChatTokenLogs"

const chatLogsSchema = new Schema<IChatTokenLogs>({
    user_id: {
        type: String,
    },
    organization_id: {
        type: String,
    },
    project_id: {
        type: Schema.Types.ObjectId,
    },
    prompt_id: {
        type: Schema.Types.ObjectId,
    },
    thread_id: {
        type: Schema.Types.ObjectId,
    },
    type: {
        type: String,
        // enum: ["azure_chat"]
    },
    prompt_tokens: {
        type: Number,
        default: 0,
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    usage_token: {
        type: {}
    }
}, 
{   
    collection: "chat_logs",
    timestamps: true,
}
);
const ChatLogs = model<IChatTokenLogs>("chat_logs", chatLogsSchema);

export default ChatLogs;