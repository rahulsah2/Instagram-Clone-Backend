import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  createOrGetConversation,
  sendMessage,
  getMessages,
} from "../controllers/chat.controller";

const router = express.Router();

// create or get existing 1:1 conversation
router.post("/conversation", protect, createOrGetConversation);

// send message (also handled by socket)
router.post("/message", protect, sendMessage);

// get messages for conversation
router.get("/message/:id", protect, getMessages);

export default router;
