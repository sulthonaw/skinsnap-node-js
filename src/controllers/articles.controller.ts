import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as articleService from "@/services/articles.service.ts";
import { asyncHandler } from "@/utils/asyncHandler.ts";
import { ApiResponse } from "@/utils/ApiResponse.ts";

export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;

  const articlesData = await articleService.fetchArticles({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search as string | undefined,
    sortBy: sortBy as string | undefined,
    sortOrder: sortOrder as "asc" | "desc" | undefined,
  });

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, articlesData, "Articles fetched successfully"));
});
