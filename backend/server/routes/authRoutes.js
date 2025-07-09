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
import { setAuthCookies } from "../utils/setAuthCookies.js";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token: accessToken, refreshToken } = req.user;

    if (!accessToken || !refreshToken) {
      return res.redirect("http://localhost:5173/login?error=token_missing");
    }

    // ✅ Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // ✅ Redirect to app (no token in URL!)
    res.redirect("http://localhost:5173/dashboard");
  }
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
