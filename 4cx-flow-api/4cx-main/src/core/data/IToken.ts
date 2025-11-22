import {Types} from "mongoose";

export interface IToken {
    _id: Types.ObjectId;
    organization_id: string
    project_id: Types.ObjectId
    user_id: string
    flow_id: string
    widget_id: Types.ObjectId
    shop_name: string
    chat_thread_id: Types.ObjectId
    model_type: string
    prompt_tokens: number
    user_question_tokens: number
    conversation_history_tokens: []
    total_conversation_history_tokens: number
    text_chunks_tokens: []
    total_text_chunks_tokens: number
    completion_tokens: number
    total_prompt_tokens: number
    modelType: string
};