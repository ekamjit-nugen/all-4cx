import { Types } from "mongoose";
export const MESSAGE_ATTRIBUTE = "CHAT_MESSAGE";

export interface IOpenAiChat {
	_id: Types.ObjectId,
	organization_id: string;
	project_id: Types.ObjectId;
	name: string;
	user_id: string;
	content: string;
	thread_id: Types.ObjectId;
	role: ChatRole;
	multi_modal_image?: string;
	type: typeof MESSAGE_ATTRIBUTE;
	is_deleted: boolean;
	is_active: boolean;
};

export type ChatRole = "system" | "user" | "assistant" | "function" | "tool";
