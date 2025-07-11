import express from "express";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../controllers/contactsController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // Protect all routes

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
