import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import UserModel from "../models/UserAdmin.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Shared login logic
const authenticateUser = async (identifier, password) => {
  const user = await UserModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).populate("department");

  if (!user) throw new Error("UserNotFound");
  if (!user.active) throw new Error("UserInactive");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");

  return user;
};

const authenticateUser2 = async (identifier, password) => {
  const user = await UserModel.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) throw new Error("UserNotFound");
  if (!user.active) throw new Error("UserInactive");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("InvalidPassword");

  return user;
};

// ✅ USER LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });

    const user = await authenticateUser(identifier, password);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        userType: user.userType,
        // department: {
        //   name: user.department?.name || null,
        // },
        deptName: user.department.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        // secure: process.env.NODE_ENV === "production", // false for local dev
        // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for local dev
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: `${user.userType} login successful`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          // department: {
          //   name: user.department?.name || null,
          // },
          deptName: user.department.name,
          userType: user.userType,
        },
      });
  } catch (error) {
    const messages = {
      UserNotFound: "User not found",
      UserInactive: "User is inactive",
      InvalidPassword: "Invalid password",
    };
    const message = messages[error.message] || "Internal server error";
    const status =
      message === "Internal server error"
        ? 500
        : error.message === "InvalidPassword"
        ? 401
        : 403;

    res.status(status).json({ success: false, message });
  }
};

//--------------- new login -----------------
// export const login = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;
//     if (!identifier || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username/email and password are required",
//       });
//     }

//     const user = await authenticateUser(identifier, password);

//     const token = jwt.sign(
//       {
//         id: user._id,
//         username: user.username,
//         userType: user.userType,
//         deptName: user.department.name,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // ✅ Cookie settings — match these in logout
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true, // true in prod
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//       path: "/", // critical for matching logout
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     };

//     res
//       .cookie("token", token, cookieOptions)
//       .status(200)
//       .json({
//         success: true,
//         message: `${user.userType} login successful`,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           username: user.username,
//           deptName: user.department.name,
//           userType: user.userType,
//         },
//       });
//   } catch (error) {
//     const messages = {
//       UserNotFound: "User not found",
//       UserInactive: "User is inactive",
//       InvalidPassword: "Invalid password",
//     };
//     const message = messages[error.message] || "Internal server error";
//     const status =
//       message === "Internal server error"
//         ? 500
//         : error.message === "InvalidPassword"
//         ? 401
//         : 403;

//     res.status(status).json({ success: false, message });
//   }
// };

// ✅ LOGOUT FUNCTION
export const logout = (req, res) => {
  console.log("Logout request received");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/", // ✅ Important to match the path used when setting cookie
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// --------------------------------------
// export const logout = (req, res) => {
//   console.log("Logout request received");

//   // ✅ Must match exactly with login cookie settings
//   const cookieOptions = {
//     httpOnly: true,
//     secure: true,
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//     path: "/", // critical for deletion
//   };

//   res.clearCookie("token", cookieOptions);

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

// ✅ ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });

    const user = await authenticateUser2(identifier, password);

    if (user.userType !== "Admin")
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });

    const token = jwt.sign({ id: user._id, role: user.userType }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          userType: user.userType,
        },
      });
  } catch (error) {
    const messages = {
      UserNotFound: "User not found",
      UserInactive: "User is inactive",
      InvalidPassword: "Invalid password",
    };
    const message = messages[error.message] || "Internal server error";
    const status =
      message === "Internal server error"
        ? 500
        : error.message === "InvalidPassword"
        ? 401
        : 403;

    res.status(status).json({ success: false, message });
  }
};

export const checkAuth = (req, res) => {
  // At this point, authMiddleware has already verified the token
  // and attached the decoded user info to req.user
  res.status(200).json({
    success: true,
    message: "Valid session",
    user: req.user,
  });
};
