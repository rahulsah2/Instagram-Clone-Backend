export default class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish operational vs programming errors

    // Capture proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
