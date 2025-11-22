import { Document, Schema } from "mongoose";

export interface IOuterboundJob extends Document {
    organization_id: string;
    project_id:  Schema.Types.ObjectId;
    user_id: string;
	ai_voice_prompt_id: Schema.Types.ObjectId,
    job_name: string;
    category_tag : string;
    phone_number : string;
    description: string;
    is_active: boolean;
    is_deleted: boolean;
}
