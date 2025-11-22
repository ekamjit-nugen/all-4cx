import { Schema, Types, model } from "mongoose"; // Adjust the import path according to your structure
import { IAiVoicePrompt } from "../IAiVoice";

const AiVoicePromptSchema = new Schema<IAiVoicePrompt>(
  {
    prompt_id: {
      type: Schema.Types.ObjectId,
    },
    prompt_title: { 
      type: String
    },
    category: { 
      type: String
    },
    prompt_text: { 
      type: String
    },
    intro_prompt: { 
      type: String
    },
    business_logic_type: { 
      type: String, 
      enum: ["PROMPT", "FLOW"], // Add the possible values here
    },
    closure_prompt: { 
      type: String
    },
    is_organization: { 
      type: Boolean
    },
    flowise_id: {
        type: String,
    },
    flowise_page: {},
    version: {
			type: Number,
			default: 1,
			// required: true,
		},
    cloned: {
      type: Number,
      default: 0,
    },
    archive_status: {
      type: Boolean,
      default: false,
    },
    runs: {
      type: Number,
      default: 0,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
  },
  {
    collection: "ai_voice_prompt",
    timestamps: true,
  }
);

const AiVoicePrompt = model<IAiVoicePrompt>("ai_voice_prompt", AiVoicePromptSchema);

export default AiVoicePrompt;
