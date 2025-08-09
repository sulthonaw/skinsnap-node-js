import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as authService from "@/services/auth.service.ts";
import { asyncHandler } from "@/utils/asyncHandler.ts";
import { ApiResponse } from "@/utils/ApiResponse.ts";

export const googleLogin = (req: Request, res: Response) => {
  const url = authService.getGoogleAuthURL();
  res.redirect(url);
};

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const { user, accessToken } = await authService.handleGoogleCallback(code);
  res.redirect(`http://localhost:3000/auth/success?token=${accessToken}`);
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, user, "User profile fetched successfully"));
});
