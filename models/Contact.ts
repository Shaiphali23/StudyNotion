import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  message: string;
}

const contactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
