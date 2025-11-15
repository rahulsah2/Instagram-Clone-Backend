import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: "path" in err ? err.path : "unknown",
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
    return;
  }

  next();
};
