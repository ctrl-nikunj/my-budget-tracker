import express from "express";
const router = express.Router();
import {
  addReminder,
  getReminders,
  updateReminderStatus,
  deleteReminder,
} from "../controllers/remindersController.js";
import verifyToken from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/:user_id", getReminders);
router.post("/add", addReminder);
router.put("/:id/status", updateReminderStatus);
router.delete("/:id", deleteReminder);

export default router;
