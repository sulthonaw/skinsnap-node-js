import { Router } from "express";
import * as authController from "@/controllers/auth.controller.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.ts";

const router = Router();

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);
router.get("/me", authMiddleware, authController.getUserProfile);

export default router;
