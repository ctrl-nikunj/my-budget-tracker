import dotenv from "dotenv";
dotenv.config();

import pool from "../db/index.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import nodemailer from "nodemailer";

// REFRESH TOKEN - from HttpOnly cookie
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "Refresh token missing" });

  try {
    const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(userData);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// REGISTER USER
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
    });
  }
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPw = crypto.createHash("sha1").update(password).digest("hex");

    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPw]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({ user, accessToken });

    console.log("Registered:", user.email);
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.error("Register Error:", err.message);
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.password_hash) {
      return res.status(403).json({ error: "Please sign in with Google" });
    }

    const hashedPw = crypto.createHash("sha1").update(password).digest("hex");

    if (hashedPw !== user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user, accessToken });

    console.log("Logged In:", email);
    console.log(refreshToken);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
    console.error("Login Error:", err.message);
  }
};

//FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Check if user exists
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate token and expiration
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to DB (overwrite if exists)
    await pool.query("DELETE FROM password_resets WHERE email = $1", [email]);
    await pool.query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)",
      [email, token, expiresAt]
    );

    // Create email transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Paylert Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>Regards,<br>Paylert Team</p>
      `,
    });

    transporter.verify((err, success) => {
      if (err) console.error("SMTP verify failed:", err);
      else console.log("SMTP connection successful");
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// 🚪 LOGOUT - Clear refresh token cookie
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Logged out successfully" });
};

//RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!strongPasswordRegex.test(newPassword)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    });
  }
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Missing token or password" });
  }

  try {
    // Look up token
    const result = await pool.query(
      "SELECT * FROM password_resets WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const { email, expires_at } = result.rows[0];
    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ error: "Token expired" });
    }

    // Hash the new password
    const hashedPw = crypto
      .createHash("sha1")
      .update(newPassword)
      .digest("hex");

    // Update password in users table
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
      hashedPw,
      email,
    ]);

    // Delete the reset token
    await pool.query("DELETE FROM password_resets WHERE email = $1", [email]);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
