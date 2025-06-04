import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import passport from "passport";
import "../auth/googleStrategy.js";
import jwt from "jsonwebtoken";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Successful login
    const token = jwt.sign(
      { id: req.user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
