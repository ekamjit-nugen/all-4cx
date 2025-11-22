import { Schema, model } from "mongoose";
import { IPrompt } from "../IPrompt";

const PromptSchema = new Schema<IPrompt>(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
        },
        organization_id: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true
        },
        prompt_type: {
            type: String,
            enum: ["PROJECT", "ORGANIZATION"],
            default: "PROJECT",
        },
        version_count: {
            type: Number,
            default: 1,
        },
        isCloned: {
            type: Boolean,
            default: false, 
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        aiVoicePrompt: {
            type: Boolean,
            default: false,
        }
    },
    {   
        collection: "prompts",
        timestamps: true,
    }
);

const Prompt = model<IPrompt>("prompts", PromptSchema);

export default Prompt;