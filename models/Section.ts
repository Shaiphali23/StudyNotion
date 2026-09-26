import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISection extends Document {
  sectionName?: string;
  subSection: Types.ObjectId[];
}

const sectionSchema = new Schema<ISection>({
  sectionName: { type: String },
  subSection: [
    { type: Schema.Types.ObjectId, required: true, ref: "SubSection" },
  ],
});

const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>("Section", sectionSchema);

export default Section;
