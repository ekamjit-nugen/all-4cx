import  { Types } from "mongoose";

export type IRole = {
    readonly _id: Types.ObjectId;
    role_name: string;
    permissions: string[];
    is_active: boolean;
    is_deleted: boolean;
};