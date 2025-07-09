export function detectBank(text) {
  if (/BDBL\d{7}/i.test(text) || /Bandhan/i.test(text)) return "Bandhan";
  if (/HDFC/i.test(text)) return "HDFC";
  if (/ICICI/i.test(text)) return "ICICI";
  if (/Axis/i.test(text)) return "Axis";
  if (/SBI/i.test(text)) return "SBI";
  if (/Canara/i.test(text)) return "Canara";
  return "Unknown";
}
