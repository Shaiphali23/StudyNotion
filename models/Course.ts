import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourse extends Document {
  courseName?: string;
  courseDescription?: string;
  instructor: Types.ObjectId;
  whatYouWillLearn?: string;
  courseContent: Types.ObjectId[];
  ratingAndReviews: Types.ObjectId[];
  price: number;
  thumbnail?: string;
  tag: string[];
  category?: Types.ObjectId;
  studentsEnrolled: Types.ObjectId[];
  instructions?: string[];
  status?: "Draft" | "Published";
  createdAt: Date;
}

const courseSchema = new Schema<ICourse>({
  courseName: { type: String, trim: true },
  courseDescription: { type: String },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  whatYouWillLearn: { type: String },
  courseContent: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  ratingAndReviews: [{ type: Schema.Types.ObjectId, ref: "RatingAndReview" }],
  price: { type: Number, required: true },
  thumbnail: { type: String },
  tag: { type: [String], required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  studentsEnrolled: [
    { type: Schema.Types.ObjectId, ref: "User", required: true },
  ],
  instructions: { type: [String] },
  status: { type: String, enum: ["Draft", "Published"] },
  createdAt: { type: Date, default: Date.now },
});

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
