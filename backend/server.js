import dotenv from "dotenv";
dotenv.config();

console.log("→ MAIL_PASS is:", process.env.MAIL_PASS ? "[FOUND]" : "[MISSING]");
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
import contactsRoutes from "./server/routes/contactsRoutes.js";
import authRoutes from "./server/routes/authRoutes.js";
import transactionRoutes from "./server/routes/transactions.js";
import reminderRoutes from "./server/routes/reminders.js";
import { startCronJobs } from "./server/utils/cronJobs.js";
import users from "./server/routes/users.js";
import "./server/auth/googleStrategy.js";
import passport from "passport";
import fdRoutes from "./server/routes/fdRoutes.js";
import analyticsRoutes from "./server/routes/analyticsRoutes.js";
import bankRoutes from "./server/routes/bankRoutes.js";
import statementRoutes from "./server/routes/statementRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/transactions", transactionRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/fds", fdRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", users);
startCronJobs();

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/statement", statementRoutes);
app.use("/api/contact", contactsRoutes);
app.get("/", (req, res) => {
  res.send("Budget Tracker API is running!!!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
