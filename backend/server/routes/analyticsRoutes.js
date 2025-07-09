import express from "express";
import {
  getAnalyticsSummary,
  getDailyTrend,
  getMonthlyTrend,
  getCategoryBreakdown,
  getCustomAnalytics,
  getChartMetrics,
} from "../controllers/analyticsController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/summary", verifyToken, getAnalyticsSummary);
router.get("/chart", verifyToken, getChartMetrics);
router.get("/daily-trend", verifyToken, getDailyTrend);
router.get("/monthly-trend", verifyToken, getMonthlyTrend);
router.get("/category-breakdown", verifyToken, getCategoryBreakdown);
router.get("/custom-analytics", verifyToken, getCustomAnalytics);

export default router;
