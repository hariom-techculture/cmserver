import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token1;
  console.log("🟡 [authMiddleware] Token from cookies:", token);
  console.log("🟡 [authMiddleware] JWT Secret:", process.env.JWT_SECRET);

  if (!token) {
    console.log("🔴 [authMiddleware] No token found in cookies");
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Authenticated user:", decoded);
    req.user = decoded; // attach user info to request
    next(); // allow the route to continue
  } catch (err) {
    console.log("🔴 [authMiddleware] JWT verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
