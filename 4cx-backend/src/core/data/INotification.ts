import {Types} from "mongoose";

export interface INotification {
    _id: Types.ObjectId,
    organization_id: string,
    project_id: Types.ObjectId,
    user_id: string,
    service: string,
    service_id: Types.ObjectId,
    title: string,
    status: Status,
    is_deleted: boolean,
    is_active: boolean,
};

export type Status = "Progress" | "Failed" | "Completed";