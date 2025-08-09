import { Router } from "express";
import * as articleController from "@/controllers/articles.controller.ts";

const router = Router();

router.get("/", articleController.getArticles);

export default router;
