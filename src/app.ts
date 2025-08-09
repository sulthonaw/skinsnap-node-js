import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { config } from "@/config/index.ts";
import { ApiError } from "@/utils/ApiError.ts";
import { errorMiddleware } from "@/middlewares/error.middleware.ts";
import authRoutes from "@/routes/auth.routes.ts";
import articleRoutes from "@/routes/articles.routes.ts";
import doctorRoutes from "@/routes/doctors.routes.ts";
import analysisRoutes from "@/routes/analysis.routes.ts";

const app: Express = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(helmet());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/analysis", analysisRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Server is healthy and running!",
    timestamp: new Date().toISOString(),
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not Found: The requested URL was not found on this server."));
});

app.use(errorMiddleware);

export default app;
