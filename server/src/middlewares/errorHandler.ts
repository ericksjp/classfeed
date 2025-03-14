import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/customError";
import { getErrorMessage } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        details: err.details
      },
    });
    return;
  }

  // invalid json
  if (err instanceof SyntaxError) {
    res.status(400).json({
      error: {
        message: getErrorMessage(err),
      },
    });
    return
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(err) || "An unexpected error occurred. Please try again later.",
    },
  });
};
