import express from "express";
const router = express.Router();
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  //getMonthlyTransactions,
  getRecentTransactions,
  getDashboardStats,
} from "../controllers/transactionsController.js";
import verifyToken from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/", getTransactions);
router.get("/recent", getRecentTransactions);
router.get("/stats", getDashboardStats);
router.post("/add", addTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
//router.get("/month", getMonthlyTransactions);

export default router;
