import { Schema, model, Document, Types } from "mongoose";
import { IRole } from "../IRole";

const RoleSchema = new Schema<IRole>(
    {
        role_name: { 
            type: String, 
            required: true 
        },
        permissions: { 
            type: [String], 
            required: true 
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
        collection: "role",
        timestamps: true,
    }
);

const Role = model<IRole>("role", RoleSchema);

export default Role;
