// routes/message.routes.ts
import { Router } from "express";
import { getMessages } from "../controllers/message.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// GET /api/messages/:conversationId
router.get("/:conversationId",protect, getMessages);

export default router;
