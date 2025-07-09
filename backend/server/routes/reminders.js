import express from "express";
const router = express.Router();
import {
  addReminder,
  getReminders,
  updateReminderStatus,
  deleteReminder,
  getRecentReminders,
} from "../controllers/remindersController.js";
import verifyToken from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/", getReminders);
router.get("/recent", getRecentReminders);
router.post("/add", addReminder);
router.put("/:id/status", updateReminderStatus);
router.delete("/:id", deleteReminder);

export default router;
