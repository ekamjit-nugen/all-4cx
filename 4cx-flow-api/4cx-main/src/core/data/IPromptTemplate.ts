import { Types } from "mongoose";

export interface IPromptTemplate {
	readonly _id: Types.ObjectId;
	title: string;
	organization_id: string;
	project_id: Types.ObjectId;
	user_id: string;
	category: [];
	task: string;
	input_media: string;
    system_message: string;
    input_prompt: string;
    sample_response: string;
	is_deleted: boolean;
	is_active: boolean;
}
