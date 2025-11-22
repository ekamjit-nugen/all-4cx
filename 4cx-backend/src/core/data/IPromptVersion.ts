import { Types } from "mongoose";

export interface IPromptVersion {
	readonly _id: Types.ObjectId;
	prompt_id: Types.ObjectId;
	prompt_title: string;
	prompt_text: string;
	prompt_type: string;
	category: string;
	runs: number;
	version: number;
	archive_status: boolean;
	cloned: number;
	is_deleted: boolean;
	is_active: boolean;
}
