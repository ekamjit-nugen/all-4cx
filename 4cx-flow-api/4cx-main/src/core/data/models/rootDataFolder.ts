import { Schema, model, } from "mongoose";
import { IRootDataFolder } from "../IRootDataFolder";

const RootFolderSchema = new Schema<IRootDataFolder>(
    {
        file_name: {
            type: String
        },
        project_id: {
            type: Schema.Types.ObjectId
        },
        is_deleted: {
            type: Boolean,
            default: false 
        },
        is_active: {
            type: Boolean,
            default: true
        },
    },
    {   
        collection: "root_data_folders",
        timestamps: true 
    }
);

const RootFolder = model<IRootDataFolder>("root_data_folders", RootFolderSchema);

export default RootFolder;
