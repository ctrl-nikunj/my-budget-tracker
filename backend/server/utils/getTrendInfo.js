export function getTrendInfo(type, current, previous) {
  const delta = current - previous;
  const percent = previous === 0 ? 100 : Math.abs((delta / previous) * 100);
  let trend = "steady";
  let message = "No major change";

  if (delta === 0) {
    trend = "steady";
  } else if (delta > 0) {
    trend = "up";
  } else {
    trend = "down";
  }

  switch (type) {
    case "income":
      if (trend === "up") message = "Income increased from last month";
      else if (trend === "down") message = "Income dropped from last month";
      break;

    case "expense":
      if (trend === "up") message = "Expenses increased — Review Your Spending";
      else if (trend === "down") message = "Expenses decreased — Well Managed";
      break;

    case "savings":
      if (trend === "up") message = "Savings increased — Great Job!";
      else if (trend === "down")
        message = "Savings fell — reconsider saving goals";
      break;

    case "emi":
      if (trend === "up") message = "EMI payments increased";
      else if (trend === "down") message = "EMI payments reduced";
      break;

    default:
      message = "No major change";
  }

  return {
    percent: percent.toFixed(1),
    trend,
    message,
  };
}
