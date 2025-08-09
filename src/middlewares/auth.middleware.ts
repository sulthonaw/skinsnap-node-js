import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { config } from "@/config/index.ts";
import { ApiError } from "@/utils/ApiError.ts";
import { prisma } from "@/prisma/client.ts";
import { IAuthRequest } from "@/types/index.ts";

export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: Access token is missing.");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: Invalid token or user does not exist.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, `Unauthorized: ${error.message}`));
    } else {
      next(error);
    }
  }
};
