import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]; // usually 2 for private chats
  isGroup: boolean;
  name?: string;
  lastMessage?: mongoose.Types.ObjectId;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isGroup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// for quick lookup of 1:1 conversation by participants
conversationSchema.index({ participants: 1 });

export default mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
