import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import { sendSuccess } from "../utils/sendSuccess";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password} = req.body;

  const { user } = await registerUser(name, email, password);
  if (!user) {
    throw new AppError("Registration failed", 500);
  }
  return sendSuccess(res, { user }, "User registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);
 return sendSuccess(res,{user,token},"user login successfully",201)
});
