import {Types} from "mongoose";
export interface IProject {
    readonly _id: Types.ObjectId;
    title:  string;
    clerk_org_id:  string;
    owner_id:  string;
    collaborators:  string[];
    data_id:  Types.ObjectId;
    is_active: Boolean;
    is_deleted: Boolean;
    created_at: Date;
    updated_at: Date;
};