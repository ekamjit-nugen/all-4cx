import { Document } from "mongoose";

export interface IPhoneNumber extends Document {
    phoneNumberName : string;
    phoneNumber: string;
    region: string;
    description: string;
    category: string;
    status: string;
    user_id: string;
    organization_id: string;
    project_id: string;
}
