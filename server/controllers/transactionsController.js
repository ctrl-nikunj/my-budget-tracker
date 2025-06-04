import pool from "../db/index.js";

// Get all transactions for the authenticated user
export const getTransactions = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add a new transaction for the authenticated user
export const addTransaction = async (req, res) => {
  const { type, category, amount, note, transaction_date } = req.body;
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
