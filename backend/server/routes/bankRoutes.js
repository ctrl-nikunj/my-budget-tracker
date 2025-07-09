import express from "express";
import {
  getBankDetails,
  addBankDetails,
} from "../controllers/bankController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getBankDetails);
router.post("/add", addBankDetails);

export default router;
