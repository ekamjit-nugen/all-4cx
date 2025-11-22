import { Schema, model, Document, Types } from "mongoose";
import { ITenant } from "../ITenant";

const TenantSchema = new Schema<ITenant>(
  {
    clerk_id: {
      type: String,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      // required: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    token_usage: {
      prompt_tokens: {
          type: Number,
          default: 0,
      },
      completion_tokens: {
          type: Number,
          default: 0,
      },
      total_tokens: {
          type: Number,
          default: 0,
      }
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "tenant",
    timestamps: true,
  }
);

const Tenant = model<ITenant>("tenant", TenantSchema);

export default Tenant;
