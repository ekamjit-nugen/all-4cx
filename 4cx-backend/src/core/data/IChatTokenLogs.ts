import {Types} from "mongoose";

export interface IChatTokenLogs {
    _id: Types.ObjectId,
    user_id: string,
    organization_id: string,
    project_id: Types.ObjectId,
    prompt_id: Types.ObjectId,
    thread_id: Types.ObjectId,
    prompt_tokens: number,
    type: string,
    usage_token: {},
    is_deleted: boolean,
    is_active: boolean,
};
