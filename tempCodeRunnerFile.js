import dotenv from "dotenv";
dotenv.config();

console.log(
  "→ JWT_SECRET is:",
  process.env.JWT_SECRET ? "[FOUND]" : "[MISSING]"
);

import express from "express";
import cors from "cors";

import authRoutes from "./server/routes/authRoutes.js";
import transactionRoutes from "./server/routes/transactions.js";
import reminderRoutes from "./server/routes/reminders.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/reminders", reminderRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Budget Tracker API is running!!!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
