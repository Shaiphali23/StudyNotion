import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISubSection extends Document {
  title?: string;
  timeDuration?: string;
  description?: string;
  videoUrl?: string;
}

const subSectionSchema = new Schema<ISubSection>({
  title: { type: String },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String },
});

const SubSection: Model<ISubSection> =
  mongoose.models.SubSection ||
  mongoose.model<ISubSection>("SubSection", subSectionSchema);

export default SubSection;
