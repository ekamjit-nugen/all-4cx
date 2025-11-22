import { Types } from "mongoose";

export type IConversation = {
    readonly _id: Types.ObjectId;
    project_id: Types.ObjectId;
    bot_name: string;
    language: string;
    response_time_limit: number;
    default_response: string;
    learning_enabled: boolean;
};