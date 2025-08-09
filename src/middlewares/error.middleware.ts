import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "@/utils/ApiError";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "An unexpected error occurred on the server.";
  let errors: any[] = [];
  let stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    console.error("UNHANDLED ERROR:", err);
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(stack && { stack }),
  };

  res.status(statusCode).json(response);
};
