const API_BASE = "http://localhost:5000/api/auth";

export const handleForgotPassword = async ({ email }) => {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Reset link dispatch Failed!");
  }
  return { res, data };
};
