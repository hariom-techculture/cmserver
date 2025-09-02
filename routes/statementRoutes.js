// routes/statementRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import * as statementController from "../controllers/statementController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post(
  "/",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  statementController.createStatement
);

router.get("/", statementController.getAllStatements);
router.get("/status", statementController.getStatementsByStatus);
router.get("/status-counts", statementController.getStatementSummary);
router.get("/:id", statementController.getStatementById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  statementController.updateStatement
);

router.delete("/:id", statementController.deleteStatement);

export default router;
