export function parse(text, bank) {
  switch (bank) {
    case "Bandhan":
      return parseBandhan(text);
    case "HDFC":
      return parseHdfc(text);
    case "ICICI":
      return parseIcici(text);
    default:
      throw new Error("Unsupported bank");
  }
}

function parseBandhan(text) {
  const lines = text.split("\n");
  const transactions = [];

  // Merge multi-line transactions
  let currentLine = "";
  for (const line of lines) {
    if (/^\w+\d{2}, \d{4}/.test(line)) {
      if (currentLine) {
        transactions.push(currentLine);
      }
      currentLine = line.trim();
    } else {
      currentLine += " " + line.trim();
    }
  }
  if (currentLine) {
    transactions.push(currentLine);
  }

  const parsed = [];
  const regex =
    /([A-Za-z]+\d{2}, \d{4})([A-Za-z]+\d{2}, \d{4})(.*?)(INR[\d,.]+)(Dr|Cr)(INR[\d,.]+)/;

  for (const txn of transactions) {
    const match = regex.exec(txn);
    if (match) {
      parsed.push({
        date: match[1].trim(),
        value_date: match[2].trim(),
        description: match[3].trim(),
        amount: parseFloat(match[4].replace(/INR|,/g, "")),
        dr_cr: match[5],
        balance: parseFloat(match[6].replace(/INR|,/g, "")),
      });
    }
  }

  return parsed;
}

function parseHdfc(text) {
  /* your HDFC regex */
}
function parseIcici(text) {
  /* your ICICI regex */
}
