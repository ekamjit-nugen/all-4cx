import { Types } from "mongoose";

export type IInsight = {
    readonly _id: Types.ObjectId;
    project_id: Types.ObjectId;
    data_sources: string;
    analysis_depth: number;
    report_format: string;
    stt_enabled: boolean;
    insights_schedule: string;
};