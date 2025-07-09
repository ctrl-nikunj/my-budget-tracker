import express from "express";
import {
  createFD,
  getFDs,
  breakFD,
  deleteFD,
} from "../controllers/fdController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/add", createFD);
router.get("/", getFDs);
router.patch("/:id/break", breakFD);
router.delete("/:id", deleteFD);

export default router;
