import express from "express";
import { login, logout, checkAuth } from "../controllers/authController.js";
import cmMiddleware from "../middleware/cmMiddleware.js";
// import { departmentLogin } from "../controllers/authAdminController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", cmMiddleware, checkAuth);
// router.post("/department-login", departmentLogin);

export default router;
