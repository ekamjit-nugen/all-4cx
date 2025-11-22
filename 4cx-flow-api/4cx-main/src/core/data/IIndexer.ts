import { Types } from "mongoose";

export type IIndexers = {
    readonly _id: Types.ObjectId;
    search_index_id: Types.ObjectId;
    indexers: [],
    results: [], 
};