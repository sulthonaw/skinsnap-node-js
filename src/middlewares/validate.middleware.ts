import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "@/utils/ApiError";

export const validate =
  (schema: Joi.ObjectSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(new ApiError(StatusCodes.BAD_REQUEST, "Validation failed", errorMessages));
    }

    req[property] = value;
    return next();
  };
