import { Router } from "express";
import multer from "multer";
import * as analysisController from "@/controllers/analysis.controller.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.ts";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image file.") as any, false);
    }
  },
});

router.post("/skin", authMiddleware, upload.single("skinImage"), analysisController.analyzeSkin);

export default router;
