import { Types } from "mongoose";

export const CHAT_THREAD_ATTRIBUTE = "CHAT_THREAD";

export interface IOpenAiChatThread {
    _id: Types.ObjectId,
    organization_id: string,
    project_id: Types.ObjectId,
    name: string;
    user_id: string;
    user_name: string;
    bookmarked: boolean;
    persona_message: string;
    persona_message_title: string;
    extension: string[];
    type: typeof CHAT_THREAD_ATTRIBUTE;
    model: string;
	temperature: number;
	topP: number;
	frequencyPenalty: number;
	presencePenalty: number;
    is_deleted: boolean;
    is_active: boolean;
    chat_thread_type: String;
    flowise_id: string;
}