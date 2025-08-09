import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as analysisService from "@/services/analysis.service.ts";
import { asyncHandler } from "@/utils/asyncHandler.ts";
import { ApiResponse } from "@/utils/ApiResponse.ts";
import { ApiError } from "@/utils/ApiError.ts";
import { IAuthRequest } from "@/types/index.ts";

export const analyzeSkin = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const file = req.file;
  const userId = req.user?.id;

  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "An image file is required for analysis.");
  }
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated.");
  }

  const analysisResult = await analysisService.analyzeSkinCondition(file, userId);

  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, analysisResult, "Skin analysis completed successfully."));
});
