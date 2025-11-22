import { Schema, model, Document, Types } from "mongoose";
import { IIndexers } from "../IIndexer";

const IndexerSchema = new Schema<IIndexers>(
    {
        search_index_id: { 
            type: Schema.Types.ObjectId, 
            required: true,
        },
        indexers: {
            type: []
        },
        results: {
            type: []
        }
    },
    {   
        collection: "indexers",
        timestamps: true
    }
);

const Indexers = model<IIndexers>("indexers", IndexerSchema);

export default Indexers;
