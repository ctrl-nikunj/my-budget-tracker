// analyticsController.js
import pool from "../db/index.js";

// Utility: Get date range for this month
const getThisMonthRange = () => {
  const start = new Date();
  start.setDate(1);
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

export const getAnalyticsSummary = async (req, res) => {
  const userId = req.user.id;
  const { start, end } = getThisMonthRange();

  console.log("[getAnalyticsSummary]", { userId, start, end });

  try {
    const summaryRes = await pool.query(
      `
      SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
        COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END), 0) AS savings,
        COALESCE(SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END), 0) AS emi,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS credit
      FROM transactions
      WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3
      `,
      [userId, start, end]
    );

    const s = summaryRes.rows[0];
    const income = parseFloat(s.income || 0);
    const expense = parseFloat(s.expense || 0);
    const savings = parseFloat(s.savings || 0);
    const emi = parseFloat(s.emi || 0);
    const credit = parseFloat(s.credit || 0);

    const netCashflow = income - (expense + emi + credit);
    const savingsRate = income ? ((savings / income) * 100).toFixed(2) : 0;
    const debtRatio = income ? (((emi + credit) / income) * 100).toFixed(2) : 0;

    const data = {
      income,
      expense,
      savings,
      emi,
      credit,
      netCashflow,
      savingsRate,
      debtRatio,
    };

    res.json(data);
  } catch (err) {
    console.error("[Summary Error]", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getDailyTrend = async (req, res) => {
  const userId = req.user.id;
  const { start, end } = req.query;

  try {
    const trendRes = await pool.query(
      `SELECT transaction_date::date AS date,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
        COALESCE(SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END), 0) AS savings,
        COALESCE(SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END), 0) AS emi,
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS credit
      FROM transactions
      WHERE user_id = $1 AND transaction_date::date >= $2::date AND transaction_date::date <= $3::date
      GROUP BY transaction_date::date
      ORDER BY transaction_date::date ASC`,
      [userId, start, end]
    );

    const dailyData = trendRes.rows.map((row) => ({
      date: new Date(row.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      Income: parseFloat(row.income),
      Expense: parseFloat(row.expense),
      Savings: parseFloat(row.savings),
      EMI: parseFloat(row.emi),
      Credit: parseFloat(row.credit),
    }));

    res.json({ data: dailyData });
  } catch (err) {
    console.error("[Daily Trend Error]", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getMonthlyTrend = async (req, res) => {
  const user_id = req.user.id;
  // Get current month range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const result = await pool.query(
      `SELECT 
         DATE_TRUNC('month', transaction_date) AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
         SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END) AS savings,
         SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS credit,
         SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END) AS emi
       FROM transactions
       WHERE user_id = $1
         AND transaction_date >= $2
         AND transaction_date < $3
       GROUP BY month
       ORDER BY month DESC`,
      [user_id, startOfMonth, endOfMonth]
    );
    const formattedRows = result.rows.map((row) => ({
      ...row,
      income: parseFloat(row.income) || 0,
      expense: parseFloat(row.expense) || 0,
      savings: parseFloat(row.savings) || 0,
      credit: parseFloat(row.credit) || 0,
      emi: parseFloat(row.emi) || 0,
      month: row.month.toISOString().split("T")[0], // Format date to YYYY-MM-DD
    }));
    res.json(formattedRows);
  } catch (err) {
    console.error("Get monthly transactions error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  const userId = req.user.id;
  const { type, start, end } = req.query;

  try {
    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1 AND type = $2 AND transaction_date BETWEEN $3 AND $4
       GROUP BY category
       ORDER BY total DESC`,
      [userId, type, start, end]
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("[Category Breakdown Error]", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getCustomAnalytics = async (req, res) => {
  const userId = req.user.id;
  const { start, end, type, category } = req.query;

  let baseQuery = `SELECT * FROM transactions WHERE user_id = $1`;
  const params = [userId];
  let idx = 2;

  if (start && end) {
    baseQuery += ` AND transaction_date BETWEEN $${idx} AND $${idx + 1}`;
    params.push(start, end);
    idx += 2;
  }
  if (type) {
    baseQuery += ` AND type = $${idx}`;
    params.push(type);
    idx++;
  }
  if (category) {
    baseQuery += ` AND category = $${idx}`;
    params.push(category);
  }

  try {
    const result = await pool.query(baseQuery, params);
    res.json({ data: result.rows });
  } catch (err) {
    console.error("[Custom Analytics Error]", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getChartMetrics = async (req, res) => {
  const user_id = req.user.id;
  const { range = "30d" } = req.query;

  let startDate;
  const today = new Date();

  if (range === "7d") {
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
  } else if (range === "90d") {
    startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 2);
    startDate.setDate(1);
  } else {
    // default to 30d
    startDate = new Date(today);
    startDate.setMonth(today.getMonth());
    startDate.setDate(today.getDate() - 29);
  }

  const formattedStart = startDate.toISOString().split("T")[0];
  const formattedEnd = today.toISOString().split("T")[0];

  try {
    const query = `
      SELECT transaction_date::date AS date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'savings' THEN amount ELSE 0 END) AS savings,
        SUM(CASE WHEN type = 'emi' THEN amount ELSE 0 END) AS emi,
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS credit,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3
      GROUP BY date
      ORDER BY date;
    `;

    const result = await pool.query(query, [
      user_id,
      formattedStart,
      formattedEnd,
    ]);
    const formatted = result.rows.map((row) => {
      return {
        date: new Date(row.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        Income: parseFloat(row.income) || 0,
        Savings: parseFloat(row.savings) || 0,
        EMI: parseFloat(row.emi) || 0,
        Credit: parseFloat(row.credit) || 0,
        Expenses: parseFloat(row.expenses) || 0,
      };
    });
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching chart metrics", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};
