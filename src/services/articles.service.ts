import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

interface FetchArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const fetchArticles = async (params: FetchArticlesParams) => {
  const { page = 1, limit = 10, search, sortBy = "publishedAt", sortOrder = "desc" } = params;

  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput = search
    ? {
        OR: [{ title: { contains: search, mode: "insensitive" } }, { content: { contains: search, mode: "insensitive" } }, { category: { contains: search, mode: "insensitive" } }],
      }
    : {};

  const articles = await prisma.article.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalArticles = await prisma.article.count({ where });

  return {
    data: articles,
    pagination: {
      total: totalArticles,
      page,
      limit,
      totalPages: Math.ceil(totalArticles / limit),
    },
  };
};
