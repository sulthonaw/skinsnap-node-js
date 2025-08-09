import { Router } from "express";
import * as doctorController from "@/controllers/doctors.controller.ts";

const router = Router();

router.get("/", doctorController.getNearbyDoctors);

export default router;
