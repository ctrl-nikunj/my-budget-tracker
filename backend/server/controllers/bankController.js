import pool from "../db/index.js";
import { encrypt, decrypt } from "../utils/encrypt.js";

export async function getBankDetails(req, res) {
  const user_id = req.user.id;
  try {
    const result = await pool.query(
      `SELECT name, account_number, account_type, ifsc_code, branch_name, id from banks where user_id = $1`,
      [user_id]
    );
    const banks = result.rows.map((bank) => ({
      ...bank,
      account_number: decrypt(bank.account_number),
      ifsc_code: decrypt(bank.ifsc_code),
    }));
    res.json(banks);
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addBankDetails(req, res) {
  const { name, account_number, account_type, ifsc_code, branch_name } =
    req.body;
  const user_id = req.user.id;

  const encryptedAccountNumber = encrypt(account_number);
  const encryptedIFSCCode = encrypt(ifsc_code);
  try {
    const result = await pool.query(
      `insert into banks (user_id, name, account_number, account_type, ifsc_code, branch_name) values ($1,$2,$3,$4,$5,$6) returning *`,
      [
        user_id,
        name,
        encryptedAccountNumber,
        account_type,
        encryptedIFSCCode,
        branch_name,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding bank details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
