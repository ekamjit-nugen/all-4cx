	import { Schema, model, Document, Types } from "mongoose";
	import { IProject } from "../IProject";

	const ProjectSchema = new Schema<IProject>(
		{
			title: {
				type: String,
			},
			clerk_org_id: {
				type: String,
			},
			owner_id: {
				type: String,
			},
			collaborators: [],
			is_active: {
				type: Boolean,
				default: true,
			},
			is_deleted: {
				type: Boolean,
				default: false,
			},
		},
		{
			collection: "project",
			timestamps: true,
		}
	);

	const Project = model<IProject>("project", ProjectSchema);

	export default Project;
