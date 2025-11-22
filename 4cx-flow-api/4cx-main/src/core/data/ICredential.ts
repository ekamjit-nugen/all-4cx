import { Types } from "mongoose";

export interface ICredential {
  _id: Types.ObjectId;
  organization_id: string;
  project_id: Types.ObjectId;
  user_id: string;
  credential_id: string; //postgres
  credential_name: string; //postgres
  is_active: boolean;
  is_deleted: boolean;
  encrypted_data: string;
  name: string;
}
