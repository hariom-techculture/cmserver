// routes/cmHelplineRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import * as cmHelplineController from "../controllers/cmHelplineController.js";

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
  cmHelplineController.createCmHelpline
);

router.get("/", cmHelplineController.getAllCmHelplines);
router.get("/status", cmHelplineController.getCmHelplinesByStatus);
router.get("/status-counts", cmHelplineController.getCmHelplineSummary);
router.get("/:id", cmHelplineController.getCmHelplineById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  cmHelplineController.updateCmHelpline
);

router.delete("/:id", cmHelplineController.deleteCmHelpline);

export default router;
