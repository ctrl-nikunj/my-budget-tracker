import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});
// Test the connection
console.log("DB_PASSWORD typeof:", typeof process.env.DB_PASSWORD);
console.log("DB_PASSWORD value:", process.env.DB_PASSWORD);

pool.connect((err, client) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
  } else {
    console.log("Database connected successfully");
    // release();
  }
});

export default pool;
