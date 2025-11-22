import { Types } from "mongoose";

export type ISearch = {
	readonly _id: Types.ObjectId;
	organization_id: string;
	project_id: Types.ObjectId;
	user_id: string;
	language: string;
	data_source_name: string;
	num_documents: number;
	strictness_level: number;
	num_references: number;
	filters_applied: string;
	prompt_chosen: string;
	prefix_string: string;
	suffix_string: string;
	char_limit: number;
	pii_detection: boolean;
	translation: boolean;
	generate_question: boolean;
	jsonData: JSON;
	retrievalJsonData: JSON;
	status: string;
	is_active: boolean;
	is_deleted: boolean;
};

export type Status = "Pending" | "Ready to Index" | "Indexing in Progress" | "Successfully Indexed" | "Failed Indexing";
