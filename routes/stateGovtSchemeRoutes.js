import express from "express";
import multer from "multer";
import path from "path";
import * as stateGovtController from "../controllers/stateGovtSchemeController.js";

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

router.post(
  "/",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  stateGovtController.createSchemeWithFiles
);

router.get("/", stateGovtController.getAllSchemes);
router.get("/status", stateGovtController.getAnnouncementsByStatus);
router.get("/status-counts", stateGovtController.getStateAnnouncementSummary);

router.get("/:id", stateGovtController.getStateGovtSchemeById);
router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  stateGovtController.updateStateGovtScheme
);
router.delete("/:id", stateGovtController.deleteStateGovtScheme);

export default router;
