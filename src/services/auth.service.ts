import User from "../models/user.model";
import AppError from "../utils/AppError";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 400);

  const user = await User.create({ name, email, password, role });

  return { user };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(user._id.toString());
  return { user, token };
};
