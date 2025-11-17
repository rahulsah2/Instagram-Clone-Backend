import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Post from "../models/post.model";
import { sendSuccess } from "../utils/sendSuccess";
import AppError from "../utils/AppError";
import Comment from "../models/comment.model";
import Like from "../models/like.model"

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
  const { id } = req.params; // postId
  const userId = req.user._id;

  // Check if post exists
  const post = await Post.findById(id);
  if (!post) throw new AppError("Post not found", 404);

  // Check if the like already exists
  const like = await Like.findOne({ post: id, user: userId });

  let message = "";

  if (like) {
    // Unlike
    await Like.deleteOne({ _id: like._id });
    message = "Post unliked successfully";
  } else {
    // Like
    await Like.create({ post: id, user: userId });
    message = "Post liked successfully";
  }

  // Count updated likes
  const totalLikes = await Like.countDocuments({ post: id });

  console.log(`Post ${id} like status changed by user: ${userId}`);

  return sendSuccess(res, { totalLikes }, message, 200);
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;
  const { id} = req.params;
  const userId = req.user._id;
  const postId=id;
  const postExists = await Post.findById(postId);
  if (!postExists) throw new AppError("Post not found", 404);

  const comment = await Comment.create({
    user: userId,
    post: postId,
    text,
  });

  return sendSuccess(res, {comment},"Comment added successfully" , 201);
});


