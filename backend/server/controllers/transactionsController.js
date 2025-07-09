import pool from "../db/index.js";
import { getTrendInfo } from "../utils/getTrendInfo.js";

const getTrendMeta = (type, trend) => {
  if (type === "income" || type === "savings") {
    return {
      icon: trend === "up" ? "up" : trend === "down" ? "down" : "steady",
      color: trend === "up" ? "green" : trend === "down" ? "red" : "gray",
    };
  } else {
    return {
      icon: trend === "up" ? "down" : trend === "down" ? "up" : "steady", // Reversed
      color: trend === "up" ? "red" : trend === "down" ? "green" : "gray",
    };
  }
};

// Get all transactions for the authenticated user
export const getTransactions = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date::date DESC",
      [user_id]
    );
    const formatted = result.rows.map((txn) => ({
      ...txn,
      type: txn.type[0].toUpperCase() + txn.type.slice(1),
      category: txn.category[0].toUpperCase() + txn.category.slice(1),
      amount: parseFloat(txn.amount),
      transaction_date: new Date(txn.transaction_date)
        .toISOString()
        .split("T")[0],
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add a new transaction for the authenticated user
export const addTransaction = async (req, res) => {
  const { type, category, amount, note, transaction_date } = req.body;
  console.log(req.body);
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO transactions 
       (user_id, type, category, amount, note, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, type, category, amount, note, transaction_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction, only if it belongs to the authenticated user
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, note, transaction_date } = req.body;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `UPDATE transactions SET
         type = $1,
         category = $2,
         amount = $3,
         note = $4,
         transaction_date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [type, category, amount, note, transaction_date, id, user_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or not authorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a transaction, only if it belongs to the authenticated user
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or not authorized" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// export const getMonthlyTransactions = async (req, res) => {
//   const user_id = req.user.id;
//   // Get current month range
//   const now = new Date();
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

//   try {
//     const result = await pool.query(
//       `SELECT
//          DATE_TRUNC('month', transaction_date) AS month,
//          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
//          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
//          SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END) AS total_savings,
//          SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_credit,
//          SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END) AS total_emi
//        FROM transactions
//        WHERE user_id = $1
//          AND transaction_date >= $2
//          AND transaction_date < $3
//        GROUP BY month
//        ORDER BY month DESC`,
//       [user_id, startOfMonth, endOfMonth]
//     );
//     const formattedRows = result.rows.map((row) => ({
//       ...row,
//       total_income: parseFloat(row.total_income) || 0,
//       total_expense: parseFloat(row.total_expense) || 0,
//       total_savings: parseFloat(row.total_savings) || 0,
//       total_credit: parseFloat(row.total_credit) || 0,
//       total_emi: parseFloat(row.total_emi) || 0,
//       month: row.month.toISOString().split("T")[0], // Format date to YYYY-MM-DD
//     }));
//     res.json(formattedRows);
//   } catch (err) {
//     console.error("Get monthly transactions error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const getRecentTransactions = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT id, type, category, note, amount, transaction_date
       FROM transactions
       WHERE user_id = $1 
       ORDER BY transaction_date DESC
       LIMIT 10`,
      [user_id]
    );
    const formatted = result.rows.map((txn) => ({
      ...txn,
      amount: parseFloat(txn.amount),
      transaction_date: new Date(txn.transaction_date).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      ),
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Get recent transactions error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  const user_id = req.user.id;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  try {
    const result = await pool.query(
      `SELECT 
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) as total_income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) as total_expense,
       COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END),0) as total_savings,
       COALESCE(SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END),0) as total_emi
       from transactions
      WHERE user_id=$1 AND transaction_date::date Between $2 AND $3`,
      [user_id, start, end]
    );
    const prevRes = await pool.query(
      `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) as prev_income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) as prev_expense,
       COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END),0) as prev_savings,
       COALESCE(SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END),0) as prev_emi
       FROM transactions
       WHERE user_id = $1 AND transaction_date::date BETWEEN $2 AND $3`,
      [user_id, startLastMonth, endLastMonth]
    );
    if (result.rows.length === 0 || prevRes.rows.length === 0) {
      return res.status(404).json("Error in fetching stats");
    }
    const total_income = parseFloat(result.rows[0].total_income) || 0;
    const total_expense = parseFloat(result.rows[0].total_expense) || 0;
    const total_savings = parseFloat(result.rows[0].total_savings) || 0;
    const total_emi = parseFloat(result.rows[0].total_emi) || 0;
    const prev_income = parseFloat(prevRes.rows[0].prev_income) || 0;
    const prev_expense = parseFloat(prevRes.rows[0].prev_expense) || 0;
    const prev_savings = parseFloat(prevRes.rows[0].prev_savings) || 0;
    const prev_emi = parseFloat(prevRes.rows[0].prev_emi) || 0;
    const income = getTrendInfo(
      "income",
      parseFloat(total_income) || 0,
      parseFloat(prev_income) || 0
    );
    const expense = getTrendInfo(
      "expense",
      parseFloat(total_expense) || 0,
      parseFloat(prev_expense) || 0
    );
    const savings = getTrendInfo(
      "savings",
      parseFloat(total_savings) || 0,
      parseFloat(prev_savings) || 0
    );
    const emi = getTrendInfo(
      "emi",
      parseFloat(total_emi) || 0,
      parseFloat(prev_emi) || 0
    );
    res.json({
      income: {
        value: total_income,
        percentChange: income.percent,
        trend: income.trend, // "up", "down", or "steady"
        message: income.message,
        ...getTrendMeta("income", income.trend),
      },
      expense: {
        value: total_expense,
        percentChange: expense.percent,
        trend: expense.trend,
        message: expense.message,
        ...getTrendMeta("expense", expense.trend),
      },
      savings: {
        value: total_savings,
        percentChange: savings.percent,
        trend: savings.trend,
        message: savings.message,
        ...getTrendMeta("savings", savings.trend),
      },
      emi: {
        value: total_emi,
        percentChange: emi.percent,
        trend: emi.trend,
        message: emi.message,
        ...getTrendMeta("emi", emi.trend),
      },
    });
  } catch (err) {
    console.error("Get monthly stats error:", err);
    return res.status(500).json({ error: err.message });
  }
};
