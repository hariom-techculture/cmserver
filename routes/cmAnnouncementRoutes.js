import express from "express";
import multer from "multer";
import path from "path";
import * as cmController from "../controllers/cmAnnouncementController.js";
import { updateCMAnnouncement } from "../controllers/cmAnnouncementController.js";

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
  cmController.createCMAnnouncementWithFiles
);

router.get("/", cmController.getAllCMAnnouncements);
router.get("/status", cmController.getAnnouncementsByStatus);
router.get("/status-counts", cmController.getCMAnnouncementSummary);
router.get("/:id", cmController.getCMAnnouncementById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  cmController.updateCMAnnouncement
);
router.delete("/:id", cmController.deleteCMAnnouncement);

export default router;
