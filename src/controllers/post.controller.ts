import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Post from "../models/post.model";
import { sendSuccess } from "../utils/sendSuccess";
import AppError from "../utils/AppError";

// Create a new post
export const createNewPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { caption } = req.body;
    const imageUrl = (req.file as any)?.path; // <- important for TS

    if (!caption) {
      throw new AppError("Caption is required",400);
    }
    if (!imageUrl) {
      throw new AppError("Image upload failed or missing", 400);
    }

    const post = await Post.create({
      user: req.user._id,
      caption,
      imageUrl: imageUrl, // save Cloudinary URL to DB
    });

    console.log("New Post created:", post._id, "Image URL:", imageUrl);
    return sendSuccess(res,post,"posted sucessfully");
  }
);

// Get all posts (feed)
export const getPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await Post.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return sendSuccess(res, { posts }, "Posts fetched successfully");
});

// Like/unlike a post
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id);
  if (!post) throw new AppError("Post not found", 404);

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (uid: any) => uid.toString() !== userId.toString()
    );
  } else {
    post.likes.push(userId);
  }

  await post.save();

  console.log(`Post ${id} liked/unliked by user: ${userId}`);

  return sendSuccess(
    res,
    { post },
    alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
    200
  );
});

