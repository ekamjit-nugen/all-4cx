import { Schema, model, Document, Types } from "mongoose";
import { IConversation } from "../IConversation";

const ConversationSchema = new Schema<IConversation>(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
            required: true,
        },
        bot_name: { 
            type: String, 
            required: true 
        },
        language: { 
            type: String, 
            required: true 
        },
        response_time_limit: { 
            type: Number, 
            required: true 
        },
        default_response: { 
            type: String, 
            required: true 
        },
        learning_enabled: { 
            type: Boolean, 
            default: false 
        },
    },
    {   
        collection: "conversations",
        timestamps: true,
    }
);

const Conversation = model<IConversation>("conversation", ConversationSchema);

export default Conversation;
