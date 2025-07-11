import pool from "../db/index.js"; // Your pg client instance

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, type, gstin, address } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets req.user

    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    const result = await pool.query(
      `INSERT INTO contacts (user_id, name, email, phone, type, gstin, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, name, email, phone, type, gstin, address]
    );

    res.status(201).json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({ error: "Failed to create contact" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM contacts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ success: true, contacts: result.rows });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

export const updateContact = async (req, res) => {
  const contactId = req.params.id;
  const userId = req.user.id; // Assuming verifyToken sets req.user
  const { name, email, phone, type, gstin, address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE contacts
       SET name = $1, email = $2, phone = $3, type = $4, gstin = $5, address = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [name, email, phone, type, gstin, address, contactId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Contact not found or unauthorized" });
    }

    res.json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ error: "Failed to update contact" });
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM contacts
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [contactId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Contact not found or unauthorized" });
    }

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
