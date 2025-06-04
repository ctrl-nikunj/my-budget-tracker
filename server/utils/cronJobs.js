import cron from "node-cron";
import pool from "../db/index.js";
import sendEmail from "./sendEmail.js"; // your nodemailer wrapper

export function startCronJobs() {
  // 1️⃣ Daily at 8:00 AM: send upcoming-due reminder emails
  cron.schedule("0 8 * * *", async () => {
    try {
      const { rows } = await pool.query(
        `SELECT r.id, r.due_date, r.amount, r.label, u.email
         FROM reminders r
         JOIN users u ON u.id = r.user_id
         WHERE r.due_date <= NOW() + INTERVAL '1 day'
           AND r.status != 'paid'
           AND r.notified = false`
      );

      for (const rem of rows) {
        // sendEmail(to, subject, htmlBody)
        await sendEmail(
          rem.email,
          `Reminder: ${rem.label} due soon`,
          `<p>Your reminder "<strong>${rem.label}</strong>" for ₹${
            rem.amount
          } is due on ${rem.due_date.toDateString()}.</p>`
        );
        // mark as notified
        await pool.query(`UPDATE reminders SET notified = true WHERE id = $1`, [
          rem.id,
        ]);
      }

      console.log(`[Cron] Sent ${rows.length} reminder emails.`);
    } catch (err) {
      console.error("[Cron] Error sending reminder emails:", err);
    }
  });

  // 2️⃣ Daily at midnight: delete paid reminders older than 2 days
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await pool.query(
        `DELETE FROM reminders
         WHERE status = 'paid'
           AND updated_at < NOW() - INTERVAL '2 days'`
      );
      console.log(`[Cron] Deleted ${result.rowCount} paid reminders.`);
    } catch (err) {
      console.error("[Cron] Error deleting paid reminders:", err);
    }
  });
}
