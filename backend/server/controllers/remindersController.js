import pool from "../db/index.js";

// Get all reminders for the authenticated user
export const getReminders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM reminders WHERE user_id = $1 ORDER BY due_date ASC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new reminder for the authenticated user
export const addReminder = async (req, res) => {
  const { title, transaction_id, amount, due_date, note, status } = req.body;
  const user_id = req.user.id;
  const sanitizedStatus = status?.trim() ? status : "pending";
  try {
    const result = await pool.query(
      `INSERT INTO reminders 
      (user_id, transaction_id, due_date, status, note, title, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [user_id, transaction_id, due_date, sanitizedStatus, note, title, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Add reminder error:", err);
  }
};

// Update a reminder's status (user-scoped)
export const updateReminderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;
  const validStatuses = ["pending", "paid"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const result = await pool.query(
      `UPDATE reminders SET status = $1 
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, id, user_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Reminder not found or not authorized." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a reminder (user-scoped)
export const deleteReminder = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Reminder not found or not authorized." });
    }
    res.status(200).json({ message: "Reminder deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentReminders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT id, transaction_id, due_date, status, title, amount, note
       FROM reminders
       WHERE user_id = $1
       ORDER BY due_date DESC
       LIMIT 10`,
      [user_id]
    );
    const formatted = result.rows.map((txn) => ({
      id: txn.id,
      transaction_id: txn.transaction_id,
      due_date: txn.due_date ? txn.due_date.toISOString().split("T")[0] : null,
      status: txn.status,
      title: txn.title,
      amount: txn.amount !== null ? parseFloat(txn.amount) : null,
      note: txn.note,
    }));
    console.log("Recent reminders");
    res.json(formatted);
  } catch (err) {
    console.error("Get recent reminders error:", err);
    res.status(500).json({ error: err.message });
  }
};
