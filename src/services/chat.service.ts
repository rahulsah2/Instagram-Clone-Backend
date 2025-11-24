import * as ConversationRepo from "../repositories/conversation.repository";
import * as MessageRepo from "../repositories/message.repository";
import AppError from "../utils/AppError";
import mongoose from "mongoose";

export const getOrCreate1to1Conversation = async (
  userA: string,
  userB: string
) => {
  let conversation = await ConversationRepo.findOneToOneConversation(
    userA,
    userB
  );
  if (!conversation) {
    conversation = await ConversationRepo.createConversation({
      participants: [
        new mongoose.Types.ObjectId(userA),
        new mongoose.Types.ObjectId(userB),
      ],
      isGroup: false,
    });
  }
  return conversation;
};

export const sendMessageService = async (
  senderId: string,
  conversationId: string,
  text: string
) => {
  // validate
  const conversation = await ConversationRepo.findConversationById(
    conversationId
  );
  if (!conversation) throw new AppError("Conversation not found", 404);

  const message = await MessageRepo.createMessage({
    sender: new mongoose.Types.ObjectId(senderId),
    conversation: new mongoose.Types.ObjectId(conversationId),
    text,
  });

  // update conversation.lastMessage and touched time
  conversation.lastMessage = message._id;
  await conversation.save();

  // return saved message (populated)
  const saved = await MessageRepo.getMessagesByConversation(
    conversationId,
    1,
    undefined
  );
  return saved.length ? saved[saved.length - 1] : message;
};

export const getMessagesService = (
  conversationId: string,
  limit = 50,
  after?: Date
) => MessageRepo.getMessagesByConversation(conversationId, limit, after);
