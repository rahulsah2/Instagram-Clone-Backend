import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  text: string;
  isSeen?: Boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    text: { type: String, required: true },
    isSeen: { type: Boolean },
  },
  { timestamps: true }
);

// index for efficient conversation queries
messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model<IMessage>("Message", messageSchema);
