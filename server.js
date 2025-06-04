import dotenv from "dotenv";
dotenv.config();

console.log("→ MAIL_PASS is:", process.env.MAIL_PASS ? "[FOUND]" : "[MISSING]");
console.log(process.env.MAIL_PASS);
console.log(
  "GOOGLE_CLIENT_ID is:",
  process.env.GOOGLE_CLIENT_ID ? "[Found]" : "[Missing]"
);

console.log(
  "GOOGLE_CLIENT_SECRET is:",
  process.env.GOOGLE_CLIENT_SECRET ? "[Found]" : "[Missing]"
);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./server/routes/authRoutes.js";
import transactionRoutes from "./server/routes/transactions.js";
import reminderRoutes from "./server/routes/reminders.js";

import "./server/auth/googleStrategy.js";
import passport from "passport";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/transactions", transactionRoutes);
app.use("/api/reminders", reminderRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Budget Tracker API is running!!!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
