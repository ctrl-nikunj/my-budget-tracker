import express from "express";
const router = express.Router();
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionsController.js";
import verifyToken from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/", getTransactions);
router.post("/add", addTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
