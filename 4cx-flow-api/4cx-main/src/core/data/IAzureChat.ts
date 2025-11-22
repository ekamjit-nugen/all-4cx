import { Types } from "mongoose";

export type IAzureChat = {
    _id: Types.ObjectId,
    organization_id: string,
    project_id: Types.ObjectId,
    user_id: string,
    orchestrate_id: Types.ObjectId,
    ai_model: string,
    content: string,
    role: string,
    chat_history: {},
    is_active: boolean,
    is_deleted: boolean,
};