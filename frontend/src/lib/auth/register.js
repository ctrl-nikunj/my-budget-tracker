const API_BASE = "http://localhost:5000/api/auth";

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};
