import express from "express";
import { protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload"; // Cloudinary + multer
import {
  createNewPost,
  getPosts,
  likePost,
} from "../controllers/post.controller";

const router = express.Router();

// Get all posts (feed)
router.get("/", protect, getPosts);

// Create a new post (with optional image)
router.post("/", protect, upload.single("image"), createNewPost);

// Like/unlike a post
router.post("/:id/like", protect, likePost);

export default router;
