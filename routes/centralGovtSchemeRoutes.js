import express from "express";
import multer from "multer";
import path from "path";
import * as centralGovtController from "../controllers/centralGovtSchemeController.js";

const router = express.Router();

// Setup Multer
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

router.post(
  "/",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  centralGovtController.createSchemeWithFiles
);

router.get("/", centralGovtController.getAllSchemes);
router.get("/status", centralGovtController.getAnnouncementsByStatus);
router.get(
  "/status-counts",
  centralGovtController.getCentralAnnouncementSummary
);

router.get("/:id", centralGovtController.getCentralGovtSchemeById);
router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  centralGovtController.updateCentralGovtScheme
);
router.delete("/:id", centralGovtController.deleteCentralGovtScheme);

export default router;
