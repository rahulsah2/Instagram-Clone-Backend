import Conversation, { IConversation } from "../models/Conversation";
import mongoose from "mongoose";

export const findConversationById = (id: string) => Conversation.findById(id);

export const findOneToOneConversation = async (
  userA: string,
  userB: string
) => {
  // find conversation having both participants
  return Conversation.findOne({
    isGroup: false,
    participants: {
      $all: [
        new mongoose.Types.ObjectId(userA),
        new mongoose.Types.ObjectId(userB),
      ],
    },
  });
};

export const createConversation = (data: Partial<IConversation>) =>
  Conversation.create(data);

export const getUserConversations = (userId: string) =>
  Conversation.find({ participants: userId })
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
