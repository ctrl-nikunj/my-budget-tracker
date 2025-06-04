import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing or Invalid Token" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; // { id: … } available in your handlers
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default verifyToken;
