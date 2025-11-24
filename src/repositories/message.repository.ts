import Message, { IMessage } from "../models/Message";

export const createMessage = (payload: Partial<IMessage>) =>
  Message.create(payload);

export const getMessagesByConversation = (
  conversationId: string,
  limit = 50,
  after?: Date
) => {
  // basic pagination: get messages after specific date or last N
  const query: any = { conversation: conversationId };
  if (after) query.createdAt = { $gt: after };
  return Message.find(query)
    .populate("sender", "name email")
    .sort({ createdAt: 1 })
    .limit(limit);
};

export const countUnread = (conversationId: string, userId: string) =>
  Message.countDocuments({
    conversation: conversationId,
    seenBy: { $ne: userId },
  });
