import {Types} from "mongoose";

export interface IPrompt {
    readonly _id: Types.ObjectId;
    organization_id: String;
    project_id: Types.ObjectId;
    prompt_type: String;
    version_count: number;
    isCloned: Boolean,
    author: String;
    is_deleted: Boolean;
    is_active: Boolean;
    aiVoicePrompt: Boolean;
};