import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import User from "../models/user.model";

interface JwtPayload {
  id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("Not authorized, token missing", 401));

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new AppError("User not found", 401));

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Not authorized, token invalid", 401));
  }
};

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
