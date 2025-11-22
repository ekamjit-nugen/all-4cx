import { Document, Types } from "mongoose";

export interface IWidgetList extends Document {
  widgetName: string;
  projectId: Types.ObjectId,
  widgetType: number;
  widgetSource: string;
  widgetSourceVersion: number;
  framework: string;
  user_id: string;
  organization_id: string;
  flow_id : string;
  activeStatus: string;
  designTemplate: number;
  themeConfiguration: JSON;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}