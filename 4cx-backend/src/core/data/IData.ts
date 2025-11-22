import {Types} from "mongoose";

export interface IData {
    readonly _id: Types.ObjectId;
    project_id: Types.ObjectId;
    clerk_id: string;
    root_folder_id: Types.ObjectId;
    url: string;
    file_name: string;
    data_type: string;
    source_type: string;//local website
    origin: string;
    language: string;
    component: string;
    data_retention_policy: string;
    encryption_enabled: boolean;
    service: string;
    data_config_name: string;
    description: string;
    base_url: string;
    server_certification_validation: boolean;
    authentication_type: string;
    user_name: string;
    password: string;
    is_active: boolean;
    update_count: number;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
};