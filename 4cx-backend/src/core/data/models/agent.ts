import { Schema, model } from "mongoose";
import { IAgent } from "../IAgent";

const AgentSchema = new Schema<IAgent>(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
            required: true,
        },
        assist_bot_name: { 
            type: String, 
            required: true 
        },
        assist_level: { 
            type: String, 
            required: true 
        },
        escalation_protocol: { 
            type: String, 
            required: true 
        },
        logging_enabled: { 
            type: Boolean, 
            default: false 
        },
    },
    {   
        collection: "agents",
        timestamps: true,
    }
);

const Agent = model<IAgent>("agent", AgentSchema);

export default Agent;
