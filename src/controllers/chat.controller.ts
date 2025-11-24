import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import * as ChatService from "../services/chat.service";
import {sendSuccess} from "../utils/sendSuccess";

export const createOrGetConversation = asyncHandler(
  async (req: Request, res: Response) => {
    // For 1:1 chat: client supplies otherUserId
    const { otherUserId } = req.body;
    const userId = req.user._id;

    const conversation = await ChatService.getOrCreate1to1Conversation(
      userId,
      otherUserId
    );
    return sendSuccess(res, { conversation }, "Conversation ready", 200);
  }
);

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { conversationId, text } = req.body;
  if (!text || !conversationId)
    throw new Error("conversationId and text are required");

  const message = await ChatService.sendMessageService(
    userId,
    conversationId,
    text
  );
  return sendSuccess(res, { message }, "Message sent", 201);
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;
  const { limit, after } = req.query;
  const messages = await ChatService.getMessagesService(
    conversationId,
    Number(limit) || 50,
    after ? new Date(String(after)) : undefined
  );
  return sendSuccess(res, { messages }, "Messages fetched", 200);
});
