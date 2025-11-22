import { model, Schema } from "mongoose";
import { IPhoneNumber } from "../IPhoneNumber";

const phoneNumberSchema = new Schema<IPhoneNumber>({
  phoneNumberName: { type: String, required: true },
  phoneNumber: { type: String },
  region: { type: String},
  description: { type: String },
  category: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Released', 'Pending', ], default: "Pending"},
  user_id: { type: String, required: true },
  project_id: { type: String, required: true },
  organization_id: { type: String, required: true },
},
{
  collection: "phone_numbers",
  timestamps: true
});

const PhoneNumber = model('phone_number', phoneNumberSchema);

export default PhoneNumber;