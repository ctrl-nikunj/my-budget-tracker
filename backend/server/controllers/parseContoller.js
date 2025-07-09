import { unlink } from "fs/promises";
import fs from "fs";
import { extractText } from "../utils/pdfExtractor.js";
import { detectBank } from "../utils/bankDetector.js";
import { parse } from "../utils/transactionParsers.js";
import { classifyTransaction } from "../utils/ollamaClient.js";

export async function parseBankStatement(req, res) {
  console.log("🔵 Incoming request to /api/statement/parse");

  try {
    console.log("🔵 req.user:", req.user);
    console.log("🔵 req.file:", req.file);

    const user_id = req.user?.id || "No user_id (token missing?)";

    if (!req.file) {
      console.error("❌ No file uploaded.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📂 File path received from Multer:", filePath);
    console.log("📂 Does file exist on disk?", fs.existsSync(filePath));

    // Extract text
    console.log("📝 Starting PDF text extraction...");
    const pdfText = await extractText(filePath);
    console.log("✅ PDF text extraction successful.");
    console.log("📄 Extracted text preview:", pdfText.slice(0, 3000));

    // Detect bank
    console.log("🏦 Detecting bank from extracted text...");
    const bank = detectBank(pdfText);
    console.log("🏦 Detected bank:", bank);

    if (bank === "Unknown") {
      console.error("❌ Unsupported bank format detected.");
      throw new Error("Unsupported bank format");
    }

    // Parse transactions
    console.log("📊 Parsing transactions for bank:", bank);

    const rawTransactions = parse(pdfText, bank);
    console.log(`📊 Parsed ${rawTransactions.length} transactions.`);

    // Classify transactions with fallback on failure
    console.log("🤖 Starting AI classification of transactions...");
    const classified = [];
    for (const tx of rawTransactions) {
      try {
        console.log("🤖 Sending transaction to Ollama:", tx);
        const aiResult = await classifyTransaction(tx);
        console.log("✅ AI classification result:", aiResult);
        classified.push({ ...tx, ...aiResult });
      } catch (err) {
        console.error("⚠️ Ollama failed for transaction:", tx, err.message);
        classified.push({
          ...tx,
          type: "unclassified",
          note: "AI classification failed",
        });
      }
    }

    console.log("✅ All transactions classified. Sending response...");
    res.json({ bank, transactions: classified });

    // Clean up uploaded file
    console.log("🗑 Deleting uploaded file:", filePath);
    await unlink(filePath);
    console.log("🗑 Uploaded file deleted successfully.");
  } catch (err) {
    console.error("💥 Error in parseBankStatement:", err);
    res.status(500).json({ error: err.message });
  }
}
