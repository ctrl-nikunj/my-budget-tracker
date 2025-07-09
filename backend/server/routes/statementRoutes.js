import express from "express";
import { parseBankStatement } from "../controllers/parseContoller.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
const router = express.Router();
router.use(verifyToken);

const upload = multer({ dest: "uploads/" });

router.post("/parse", upload.single("file"), parseBankStatement);

export default router;
