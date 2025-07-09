const API_BASE = "http://localhost:5000/api/auth";

export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Error in logging user out!");
  }
};
