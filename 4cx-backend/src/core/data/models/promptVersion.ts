import { Schema, model } from "mongoose";
import { IPromptVersion } from "../IPromptVersion";

const PromptVersionSchema = new Schema<IPromptVersion>(
    {
        prompt_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        prompt_title: {
            type: String,
            required: true,
        },
        prompt_text: { 
            type: String,
        },
        prompt_type: {
            type: String,
            enum: ["PROJECT", "ORGANIZATION"],
            default: "PROJECT",
        },
        runs: {
            type: Number,
            default: 0,
        },
        category: { 
            type: String, 
            required: true 
        },
        archive_status: {
            type: Boolean,
            default: false,
        },
        version: {
            type: Number,
            default: 1
        },
        cloned: {
            type: Number,
            default: 0,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        }
    },
    {   
        collection: "prompt_versions",
        timestamps: true,
    }
);

const PromptVersion = model<IPromptVersion>("prompt_versions", PromptVersionSchema);

export default PromptVersion;