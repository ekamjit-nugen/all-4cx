import { Schema, model, Document, Types } from 'mongoose';
import { ILogs } from "../ILogs"

const logsSchema = new Schema<ILogs>({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    clerk_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    project_id: {
        type: Schema.Types.ObjectId,
    },
    prompt_id: {
        type: Schema.Types.ObjectId,
    },
    data_source_id: {
        type: Schema.Types.ObjectId,
    },
    token_usage: {
        prompt_tokens: {
            type: Number,
            default: 0,
        },
        completion_tokens: {
            type: Number,
            default: 0,
        },
        total_tokens: {
            type: Number,
            default: 0,
        }
    },
    activity: {
        type: String,
    },
    service: {
        type: String,
    },
    url: {
        type: String,
    },
    key: {
        type: String
    },
    thread_id: {
        type: Schema.Types.ObjectId,
    },
    data: {
        type: {
           type: String, 
        },
        response: {
            type: String,
        }
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "ERROR"],
        default: "PENDING"
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
}, 
{   
    collection: "logs",
    timestamps: true,
}
);
const Logs = model<ILogs>("logs", logsSchema);

export default Logs;