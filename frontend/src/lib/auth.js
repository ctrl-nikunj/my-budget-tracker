const API_BASE = "http://localhost:5000/api/auth";

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for cookies
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

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

export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error in logging user out!");
  }
};
