import { Schema, model } from "mongoose";
import { IPromptTemplate } from "../IPromptTemplate";

const PromptTemplateSchema = new Schema<IPromptTemplate>(
    {
        title: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
        },
        organization_id: {
            type: String,
        },
        project_id: {
            type: Schema.Types.ObjectId,
        },
	    category: [],
	    task: {
            type: String
        },
	    input_media: {
            type: String
        },
        system_message: {
            type: String,
        },
        input_prompt: {
            type: String,
        },
        sample_response: {
            type: String,
        },
	    is_deleted: {
            type: Boolean,
            default: false
        },
	    is_active: {
            type: Boolean,
            default: true
        }
    },
    {   
        collection: "prompt_template",
        timestamps: true,
    }
);

const PromptVersion = model<IPromptTemplate>("prompt_template", PromptTemplateSchema);

export default PromptVersion;