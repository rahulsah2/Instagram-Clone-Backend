import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  text: string;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", commentSchema);
