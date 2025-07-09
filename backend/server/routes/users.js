import express from "express";
import pool from "../db/index.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userQuery = await pool.query(
      "SELECT name, email FROM users WHERE id = $1",
      [userId]
    );

    const user = userQuery.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("GET /me failed:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
