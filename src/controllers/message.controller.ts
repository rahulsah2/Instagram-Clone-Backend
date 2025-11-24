// controllers/message.controller.ts
import { Request, Response } from "express";
import Message from "../models/Message";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess } from "../utils/sendSuccess";

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  // Pagination values
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  // Count total messages
  const totalMessages = await Message.countDocuments({
    conversation: conversationId,
  });

  // Fetch paginated messages
  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 }) // oldest first
    .skip(skip)
    .limit(limit)
    .populate("sender", "name email profilePic");

  const totalPages = Math.ceil(totalMessages / limit);

  return sendSuccess(
    res,
    {
      messages,
      pagination: {
        totalMessages,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    },
    "Messages fetched successfully",
    200
  );
});
