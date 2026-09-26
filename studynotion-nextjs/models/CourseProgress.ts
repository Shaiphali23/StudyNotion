import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourseProgress extends Document {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  completedVideos: Types.ObjectId[];
}

const courseProgressSchema = new Schema<ICourseProgress>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  completedVideos: [{ type: Schema.Types.ObjectId, ref: "SubSection" }],
});

const CourseProgress: Model<ICourseProgress> =
  mongoose.models.CourseProgress ||
  mongoose.model<ICourseProgress>("CourseProgress", courseProgressSchema);

export default CourseProgress;
