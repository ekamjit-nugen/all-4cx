import { Types } from "mongoose";

export interface IAgent {
    readonly _id: Types.ObjectId;
    project_id: Types.ObjectId;
    assist_bot_name: string;
    assist_level: string;
    escalation_protocol: string;
    logging_enabled: boolean;
};