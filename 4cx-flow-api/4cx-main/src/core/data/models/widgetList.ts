import mongoose, { Schema } from 'mongoose';
import { IWidgetList } from '../IWidgetList';

// Mongoose schema definition
const WidgetSchema: Schema = new Schema(
  {
    widgetName: { 
        type: String, 
        required: true 
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    widgetType: { 
        type: String, 
        required: true 
    },
    widgetSource: { 
        type: String, 
        required: true 
    },
    widgetSourceVersion: { 
        type: Number, 
        required: true 
    },
    framework: { 
        type: String, 
        required: true 
    },
    user_id: { 
        type: String, 
        required: true 
    },
    organization_id: { 
        type: String, 
        required: true 
    },
    flow_id: { 
        type: String, 
        required: true 
    },
    activeStatus : {
        type : String,
        required: true
    },
    designTemplate : {
        type : Number,
    },
    themeConfiguration: {
        type: {}
    },
    chatId: {
        type: String,
    }
  },
  {
    timestamps: true,
    collection: 'widget_List'
  }
);

// Create the Mongoose model
const WidgetModel = mongoose.model<IWidgetList>('widget_List', WidgetSchema);

export default WidgetModel;
