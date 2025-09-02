import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.cookie("token1", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "None", // Required for cross-site cookies

      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// export const logout = (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out" });
// };
export const logout = (req, res) => {
  res.clearCookie("token1", {
    httpOnly: true,
    secure: true,
    // sameSite: "lax",
    sameSite: "None", // Required for cross-site cookies
    path: "/", // ✅ very important
  });

  // res.json({ message: "Logged out" });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// export const checkAuth = (req, res) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ message: "No token found" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({ message: "Valid session", user: decoded });
//   } catch (err) {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };

export const checkAuth = (req, res) => {
  // At this point, authMiddleware has already verified the token
  // and attached the decoded user info to req.user

  res.status(200).json({
    success: true,
    message: "Valid session",
    user: req.user,
  });
};
