import {Types} from "mongoose";
import { TokenUsage } from "./ITenant";

export interface ILogs {
    _id: Types.ObjectId,
    username: string,
    email: string,
    clerk_id: string,
    user_id: string,
    organization_id: string,
    project_id: Types.ObjectId,
    prompt_id: Types.ObjectId,
    data_source_id: Types.ObjectId,
    activity: string,
    service: string,
    url: string,
    key: string,
    status: Status,
    thread_id: Types.ObjectId,
    token_usage: TokenUsage,
    data: ChatData,
    is_deleted: boolean,
    is_active: boolean,
    createdAt: Date,
    updatedAt: Date,
};


export type Status =  "PENDING" | "COMPLETED" | "ERROR";
export type ChatData = {
    type: string,
    response: string,
};
// TENANT
// ORGANIZATION
// PROMPT_TEMPLATE