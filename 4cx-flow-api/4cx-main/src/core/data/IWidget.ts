import { Document, Types } from "mongoose";

export interface IWidget extends Document {
    widget_configuration_id: Types.ObjectId
    organization_id: string
    project_id: Types.ObjectId
    user_id: string
    widget_type: string
    createdAt: Date
    updatedAt: Date
}