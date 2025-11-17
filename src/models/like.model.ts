import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

// Ensure a user can like a post only once
likeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", likeSchema);
