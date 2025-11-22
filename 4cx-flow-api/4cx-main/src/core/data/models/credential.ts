import { Schema, model } from "mongoose";
import { ICredential } from "../ICredential";

const credentialSchema = new Schema<ICredential>(
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
        credential_id: {
            type: String,
			// required: true,
        },
		credential_name: {
			type: String,
			required: true,
		},
		name: {
			type: String,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		is_deleted: {
			type: Boolean,
			default: false,
		},
		encrypted_data: {
			type: String
		}
	},
	{
        collection: "credentials",
        timestamps: true
    }
);

const credentialFlow = model("credentials", credentialSchema);

export default credentialFlow;


