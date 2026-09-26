import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  courses: Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

export default Category;
