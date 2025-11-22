import { Schema, model } from "mongoose";
import { IExtention } from "../IExtention";

const chatExtention = new Schema<IExtention>(
    {
        name: { 
            type: String, 
            required: true,
        },
        description: { 
            type: String, 
            required: true 
        },
        user_id: { 
            type: String, 
            required: true 
        },
        isPublished: { 
            type: Boolean, 
            required: true 
        },
        type: { 
            type: String, 
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
        collection: "chat_extention",
        timestamps: true
    }
);

const ChatExtention = model<IExtention>("chat_extention", chatExtention);

export default ChatExtention;
