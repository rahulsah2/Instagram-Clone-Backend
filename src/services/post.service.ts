import Post from "../models/post.model";
import AppError from "../utils/AppError";

export const createPost = async (
  userId: string,
  caption: string,
  imageUrl?: string
) => {
  const post = await Post.create({ user: userId, caption, imageUrl });
  return post;
};

export const getAllPosts = async () => {
  // populate user (to show name, email, etc.)
  const posts = await Post.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return posts;
};

export const toggleLike = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", 404);

  const alreadyLiked = post.likes.includes(userId as any);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId as any);
  }

  await post.save();
  return post;
};
