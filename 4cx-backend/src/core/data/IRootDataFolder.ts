import { Types } from "mongoose";

export interface IRootDataFolder {
    _id: Types.ObjectId,
    file_name: string,
    project_id: Types.ObjectId,
    is_deleted: boolean,
    is_active: boolean,
    createdAt: Date,
    updatedAt: Date,
};