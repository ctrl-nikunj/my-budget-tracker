import fs from "fs";
//@ts-ignore
import pdf from "pdf-extraction";

export async function extractText(filePath) {
  console.log("📂 extractText via pdf-extraction:", filePath);
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  console.log("✅ PDF text length:", data.text.length);
  return data.text;
}
