import { Types } from "mongoose";

export interface IAiVoicePrompt {
    readonly _id: Types.ObjectId;
    prompt_id: Types.ObjectId,
    prompt_title: String;
    prompt_text: String;
    category: String;
    intro_prompt: String;
    business_logic_type: String;
    closure_prompt: String;
    is_organization: Boolean;
    flowise_id: string;
    flowise_page: Number;
    version: Number;
    cloned: Number;
    runs: Number;
    archive_status: Boolean;
    is_deleted: Boolean;
    is_active: Boolean;
};