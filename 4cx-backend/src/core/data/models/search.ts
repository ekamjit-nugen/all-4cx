import { Schema, model, Document, Types } from "mongoose";
import { ISearch } from "../ISearch";

const SearchSchema = new Schema<ISearch>(
    {
        organization_id: {
            type: String,
        },
        project_id: { 
            type: Schema.Types.ObjectId, 
            // required: true,
        },
        user_id: {
            type: String,
        },
        language: { 
            type: String, 
            // required: true 
        },
        data_source_name: { 
            type: String, 
            // required: true 
        },
        num_documents: { 
            type: Number, 
            // required: true 
        },
        strictness_level: { 
            type: Number, 
            // required: true 
        },
        num_references: { 
            type: Number, 
            // required: true 
        },
        filters_applied: String,
        prompt_chosen: String,
        prefix_string: String,
        suffix_string: String,
        char_limit: { 
            type: Number, 
            // required: true 
        },
        pii_detection: { 
            type: Boolean, 
            default: false 
        },
        translation: { 
            type: Boolean, 
            default: false 
        },
        generate_question: { 
            type: Boolean, 
            default: false 
        },
        jsonData: {
            type: JSON,
        },
        retrievalJsonData: {
            type: JSON,
        },
        status: {
            type: String,
            enum: [ "Pending", "Ready to Index", "Indexing in Progress", "Successfully Indexed", "Failed Indexing"],
            default: "Pending",
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        }
    },
    {   
        collection: "searches",
        timestamps: true,
    }
);

const Search = model<ISearch>("search", SearchSchema);

export default Search;
