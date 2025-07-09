import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const algorithm = "aes-256-gcm";

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encryptedData) {
  const buffer = Buffer.from(encryptedData, "base64");
  const iv = buffer.slice(0, 12);
  const tag = buffer.slice(12, 28);
  const encrypted = buffer.slice(28);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted, null, "utf8") + decipher.final("utf8");
}
