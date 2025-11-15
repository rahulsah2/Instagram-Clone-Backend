import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

/**
 * Global Error Handling Middleware
 * Catches all errors thrown in routes or async handlers
 */
const errorHandler = (
  err: any, // Accept any error (AppError or built-in)
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default values for unknown errors
  let statusCode = 500;
  let message = "Internal Server Error";

  // If the error is an instance of our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Optional: Log all errors in development
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ Error Details:", err);
  }

  // Send consistent JSON response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
