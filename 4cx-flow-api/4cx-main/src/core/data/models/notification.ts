import { Schema, model } from "mongoose";
import { INotification } from "../INotification";

const NotificationSchema = new Schema<INotification>(
	{
        organization_id: {
            type: String,
        },
        project_id: {
            type: Schema.Types.ObjectId,
        },
        user_id: {
            type: String,
        },
        service: {
            type: String,
        },
        service_id: {
            type: Schema.Types.ObjectId,
        },
        title: {
            type: String,
        },
        status: {
            type: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        }
	},
	{
		collection: "notification",
		timestamps: true,
	}
);

const Notification = model<INotification>("notification", NotificationSchema);

export default Notification;
