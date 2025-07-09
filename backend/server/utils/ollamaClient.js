import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// Configure API URL and timeout from environment or fallback
const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT) || 100000;
// Optional: retry logic using axios-retry
import axiosRetry from "axios-retry";
axiosRetry(axios, {
  retries: 3, // retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx responses
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    );
  },
});

function fixBrokenJson(str) {
  const obj = {};
  const regex =
    /\b(type|category|note)\s+((?:(?!\btype\b|\bcategory\b|\bnote\b).)+)/gi;

  let match;
  while ((match = regex.exec(str)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    obj[key] = value;
  }

  // Sanity check for required keys
  if (!obj.type || !obj.category || !obj.note) {
    console.warn("⚠️ Partial JSON detected:", obj);
    throw new Error(JSON.stringify(obj));
  }

  return obj;
}

export async function classifyTransaction(tx) {
  console.log("🤖 classifyTransaction: Preparing prompt...");
  const prompt = `
You are a financial assistant.

Classify this bank transaction:
Date: ${tx.date}
Description: ${tx.description.slice(0, 200)}
Amount: ${tx.amount}
Dr/Cr: ${tx.dr_cr}

Return ONLY valid JSON. No explanations. No markdown. No extra text.

Example:
{
  "type": "expense",
  "category": "Shopping/Online Payment",
  "note": "Payment to vendor"
}

Now respond with JSON for the above transaction:
`;

  try {
    const res = await axios.post(
      OLLAMA_API_URL,
      {
        model: "gemma3:latest",
        prompt,
      },
      {
        timeout: OLLAMA_TIMEOUT,
        responseType: "stream",
      }
    );

    let fullResponse = "";
    await new Promise((resolve, reject) => {
      res.data.on("data", (chunk) => {
        const text = chunk.toString();
        const match = text.match(/"response":"(.*?)"/);
        if (match && match[1]) {
          const cleaned = match[1]
            .replace(/\\n/g, "")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\");
          fullResponse += cleaned;
        }
      });
      res.data.on("end", resolve);
      res.data.on("error", reject);
    });

    console.log("✅ Ollama raw response:", fullResponse);

    // 🧽 Extract and clean JSON block
    const jsonMatch = fullResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No JSON found in Ollama response");

    const cleanJson = jsonMatch[0]
      .replace(/\\+/g, "")
      .replace(/(\w+):/g, '"$1":'); // quote keys

    console.log("✅ Cleaned JSON:", cleanJson);
    const finalResult = fixBrokenJson(cleanJson);
    console.log("Final JSON: ", finalResult);

    const result = finalResult;
    console.log("✅ Parsed result:", result);

    return result;
  } catch (err) {
    console.error("❌ Ollama API error:", err.message);
    return {
      type: tx.dr_cr === "Cr" ? "income" : "expense",
      category: "Uncategorized",
      note: "AI classification failed - fallback used",
    };
  }
}
