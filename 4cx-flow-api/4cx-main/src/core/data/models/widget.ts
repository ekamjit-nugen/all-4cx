import mongoose, { Schema } from 'mongoose';
import { IWidget } from '../IWidget';

// Mongoose schema definition
const WidgetSchema: Schema = new Schema(
  {
    organization_id: {
        type: String,
    },
    project_id: {
        type: Schema.Types.ObjectId,
    },
    user_id: {
        type: String
    },
    widget_configuration_id: {
      type: Schema.Types.ObjectId,
    },
    widget_type: {
        type: String,
        // enum: [ "search", "chat-bot", "ai-voice" ]
    },
  },
  {
    timestamps: true,
    collection: 'widgets'
  }
);

// Create the Mongoose model
const Widget = mongoose.model<IWidget>('widgets', WidgetSchema);

export default Widget;
