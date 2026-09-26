import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  about?: string;
  contactNumber?: number;
}

const profileSchema = new Schema<IProfile>({
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dateOfBirth: { type: String },
  about: { type: String, trim: true },
  contactNumber: { type: Number },
});

const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
