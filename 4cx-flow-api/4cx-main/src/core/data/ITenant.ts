import {Types} from "mongoose";

export interface ITenant {
    _id: Types.ObjectId;
    clerk_id:  string;
    role_id:  Types.ObjectId;
    name: string;
    username: string;
    email: string;
    is_deleted:  boolean;
    is_active:  boolean;
    token_usage: TokenUsage;
    created_at:  Date;
    updated_at:  Date;
    api_key : string;
};

export type TokenUsage = {
	prompt_tokens: Number,
	completion_tokens: Number,
	total_tokens: Number, 
};