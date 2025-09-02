import express from "express";
import multer from "multer";
import * as pmController from "../controllers/pmAnnouncementController.js";

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
  pmController.createPMAnnouncementWithFiles
);

router.get("/", pmController.getAllPMAnnouncements);
router.get("/status", pmController.getAnnouncementsByStatus);
router.get("/status-counts", pmController.getPMAnnouncementSummary);

router.get("/:id", pmController.getPMAnnouncementById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  pmController.updatePMAnnouncement
);

router.delete("/:id", pmController.deletePMAnnouncement);

export default router;
