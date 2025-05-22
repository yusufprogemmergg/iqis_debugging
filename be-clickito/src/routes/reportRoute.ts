import { Router } from "express";
import { getDashboard } from "../controllers/reportController";

const router = Router();

router.get(`/dashboard`, getDashboard); // ini akan jadi /report/dashboard

export default router;