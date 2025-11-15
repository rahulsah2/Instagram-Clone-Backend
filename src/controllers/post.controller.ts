import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Post from "../models/post.model";

// Create a new post
export const createNewPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { caption } = req.body;
    const imageUrl = (req.file as any)?.path; // <- important for TS

    if (!caption) {
      throw new Error("Caption is required");
    }

    const post = await Post.create({
      user: req.user._id,
      caption,
      imageUrl: imageUrl, // save Cloudinary URL to DB
    });

    console.log("📌 New Post created:", post._id, "Image URL:", imageUrl);

    res.status(201).json({ success: true, post });
  }
);

// Get all posts (feed)
export const getPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await Post.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, posts });
});

// Like/unlike a post
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  const alreadyLiked = post.likes.includes(userId as any);
  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (uid) => uid.toString() !== userId.toString()
    );
  } else {
    post.likes.push(userId as any);
  }

  await post.save();
  console.log(`💖 Post ${id} liked/unliked by user: ${userId}`);

  res.status(200).json({ success: true, post });
});
