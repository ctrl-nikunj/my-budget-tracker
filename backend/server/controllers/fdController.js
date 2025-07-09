import pool from "../db/index.js";
import { differenceInMonths, addMonths } from "date-fns";
import { encrypt, decrypt } from "../utils/encrypt.js";

// CREATE FD
export async function createFD(req, res) {
  const { principal, interest_rate, duration_months, start_date, bank_id } =
    req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO fixed_deposits 
        (user_id, principal, interest_rate, duration_months, start_date, bank_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, principal, interest_rate, duration_months, start_date, bank_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("FD creation error:", err);
    res.status(500).json({ error: "Could not create FD" });
  }
}

// GET ALL FDs FOR USER
export async function getFDs(req, res) {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT fd.*, b.name AS bank_name, b.account_number
       FROM fixed_deposits fd
       JOIN banks b ON fd.bank_id = b.id
       WHERE fd.user_id = $1
       ORDER BY fd.start_date DESC`,
      [user_id]
    );

    const today = new Date();

    const enriched = result.rows.map((fd) => {
      const maturityDate = addMonths(
        new Date(fd.start_date),
        fd.duration_months
      );
      const monthsElapsed = differenceInMonths(today, new Date(fd.start_date));
      const n = Math.min(monthsElapsed, fd.duration_months);
      const rate = fd.interest_rate / 100 / 12;

      const currentValue = +(fd.principal * Math.pow(1 + rate, n)).toFixed(2);
      const account_number = decrypt(fd.account_number);
      return {
        ...fd,
        account_number: account_number,
        maturity_date: maturityDate,
        current_value: currentValue,
        is_matured: fd.is_broken ? false : monthsElapsed >= fd.duration_months,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("FD fetch error:", err);
    res.status(500).json({ error: "Could not fetch FDs" });
  }
}

// BREAK FD (SET is_broken = true)
export async function breakFD(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  const { reason } = req.body;

  try {
    const result = await pool.query(
      `UPDATE fixed_deposits
       SET is_broken = true,
           broken_date = CURRENT_DATE,
           broken_reason = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [reason || null, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "FD not found or unauthorized" });
    }

    res.json({ message: "FD marked as broken", fd: result.rows[0] });
  } catch (err) {
    console.error("Break FD error:", err);
    res.status(500).json({ error: "Could not break FD" });
  }
}

// DELETE FD
export async function deleteFD(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM fixed_deposits WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "FD not found or unauthorized" });
    }

    res.json({ message: "FD deleted successfully" });
  } catch (err) {
    console.error("FD deletion error:", err);
    res.status(500).json({ error: "Could not delete FD" });
  }
}
