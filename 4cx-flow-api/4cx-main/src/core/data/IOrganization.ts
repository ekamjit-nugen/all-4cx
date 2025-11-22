import { Types } from "mongoose";
export interface IOrganization {
	_id: Types.ObjectId;
	clerk_org_id:  string;
	org_name:  string;
	slug: string;
	createdBy: string; //clerk_user_string
	members:  string[];
	is_deleted:  boolean;
	is_active:  boolean;
	created_at:  Date;
	updated_at:  Date;
 }