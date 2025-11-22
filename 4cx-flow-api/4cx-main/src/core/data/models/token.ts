import mongoose, { Schema } from 'mongoose';
import { IToken } from '../IToken';

// Mongoose schema definition
const tokenSchema: Schema = new Schema({
    organization_id: String,
    project_id: Schema.Types.ObjectId,
    user_id: String,
    flow_id: String,
    widget_id: Schema.Types.ObjectId,
    shop_name: String,
    chat_thread_id: Schema.Types.ObjectId,
    model_type: String,
    prompt_tokens: Number,
    user_question_tokens: Number,
    conversation_history_tokens: [],
    total_conversation_history_tokens: Number,
    text_chunks_tokens: [],
    total_text_chunks_tokens: Number,
    completion_tokens: Number,
    total_prompt_tokens: Number,
    modelType: String,
  },
  {
    timestamps: true,
    collection: 'token'
  }
);

// Create the Mongoose model
const TokenModel = mongoose.model<IToken>('token', tokenSchema);

export default TokenModel;
