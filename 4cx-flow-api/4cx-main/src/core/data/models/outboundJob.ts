import { model, Schema } from "mongoose";
import { IOuterboundJob } from "../IOutboundJob";

const outboundJob = new Schema<IOuterboundJob>({
	project_id: { 
        type: Schema.ObjectId,
        required: true 
    },
	organization_id: {
        type: String,
        required: true
    },
	user_id: { 
        type: String,
        required: true
    },
	job_name: {
        type: String
    },
    ai_voice_prompt_id: {
        type: Schema.Types.ObjectId,
    },
	phone_number: {
        type: String
    },
	category_tag: {
        type: String
    },
	description: {
        type: String
    },
	is_active: {
        type: Boolean,
        default: true
    },
	is_deleted: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
    collection: "outbound_job"
}
);

const outboundJobModel = model("outbound_job", outboundJob);

export default outboundJobModel;
