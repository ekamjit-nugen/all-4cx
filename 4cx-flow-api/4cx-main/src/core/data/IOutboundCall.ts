import { Document, Schema } from "mongoose";

export interface IOuterboundCalls extends Document {
    organization_id: string;
    project_id:  Schema.Types.ObjectId;
    user_id: string;
    outbound_job_id: Schema.Types.ObjectId;
    select : boolean;
    contact_name : string;
    phone_number : string;
    category: string;
    description: string;
    scheduled: Date;
    call_length: string;
    call_connection_id: string;
	status: string,
    is_active: boolean;
    is_deleted: boolean;
}
