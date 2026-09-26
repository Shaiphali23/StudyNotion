import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "Admin" | "Student" | "Instructor";
  additionalDetails: Types.ObjectId;
  courses: Types.ObjectId[];
  image: string;
  token?: string;
  resetPasswordExpires?: Date;
  courseProgress: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  image: { type: String, required: true },
  token: { type: String },
  resetPasswordExpires: { type: Date },
  courseProgress: [{ type: Schema.Types.ObjectId, ref: "CourseProgress" }],
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
