import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRatingAndReview extends Document {
  user: Types.ObjectId;
  rating: number;
  review: string;
  course: Types.ObjectId;
}

const ratingAndReviewSchema = new Schema<IRatingAndReview>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, required: true, ref: "Course", index: true },
});

const RatingAndReview: Model<IRatingAndReview> =
  mongoose.models.RatingAndReview ||
  mongoose.model<IRatingAndReview>("RatingAndReview", ratingAndReviewSchema);

export default RatingAndReview;
