import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";

import {
  login,
  adminLogin,
  logout,
  checkAuth,
} from "../controllers/authAdminController.js";

router.post("/admin-login", adminLogin); //admin
router.post("/login", login); //depat
router.post("/logout", logout);

router.get("/check", authMiddleware, checkAuth);

export default router;
