import { Types } from "mongoose";

export interface IOrchestrate {
  _id: Types.ObjectId;
  flow_name: string;
  organization_id: string;
  project_id: Types.ObjectId;
  prompt_id: Types.ObjectId;
  prompt_version: number;
  run: number;
  version: number;
  author: string;
  json_prompt_flow: {};
  category: string;
  archive_status: boolean;
  is_active: boolean;
  is_deleted: boolean;
}
