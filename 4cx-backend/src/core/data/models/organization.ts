	import { Schema, model } from "mongoose";
	import { IOrganization } from "../IOrganization";

	const orgSchema = new Schema<IOrganization>(
		{
			clerk_org_id: {
				type: String,
			},
			org_name: {
				type: String,
			},
			slug: {
				type: String,
			},
			createdBy: {
				type: String,
			},
			members: [String],
			is_deleted: {
				type: Boolean,
				default: false,
			},
			is_active: {
				type: Boolean,
				default: true,
			},
		},
		{
			collection: "organization",
			timestamps: true,
		}
	);
	const organization = model<IOrganization>("organization", orgSchema);

	export default organization;
