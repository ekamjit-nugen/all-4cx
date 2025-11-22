import { Schema, model, Document, Types } from "mongoose";
import { IInsight } from "../IInsights";

const InsightSchema = new Schema<IInsight>(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
            required: true,
        },
        data_sources: { 
            type: String, 
            required: true 
        },
        analysis_depth: { 
            type: Number, 
            required: true 
        },
        report_format: { 
            type: String, 
            required: true 
        },
        stt_enabled: { 
            type: Boolean, 
            default: false 
        },
        insights_schedule: { 
            type: String, 
            required: true 
        },
    },
    {   
        collection: "insights",
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

const Insight = model<IInsight>("insight", InsightSchema);

export default Insight;
