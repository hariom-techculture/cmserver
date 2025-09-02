// import express from "express";
// import multer from "multer";
// import path from "path";
// import * as reviewController from "../controllers/reviewMeetingController.js";

// const router = express.Router();

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// router.post(
//   "/",
//   upload.fields([
//     { name: "momFile", maxCount: 1 },
//     { name: "letterFile", maxCount: 1 },
//     { name: "pictureFile", maxCount: 1 },
//   ]),
//   reviewController.createReviewMeetingWithFiles
// );

// router.get("/", reviewController.getAllReviewMeetings);
// router.get("/status", reviewController.getAnnouncementsByStatus);

// export default router;

import express from "express";
import multer from "multer";
import path from "path";
import * as reviewController from "../controllers/reviewMeetingController.js";

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
    { name: "momFile", maxCount: 1 },
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  reviewController.createReviewMeetingWithFiles
);

router.get("/", reviewController.getAllReviewMeetings);
router.get("/status", reviewController.getAnnouncementsByStatus);

// ✅ NEW: Get by ID
router.get("/:id", reviewController.getReviewMeetingById);

// ✅ NEW: Update by ID
router.put(
  "/:id",
  upload.fields([
    { name: "momFile", maxCount: 1 },
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  reviewController.updateReviewMeeting
);

// ✅ NEW: Delete by ID
router.delete("/:id", reviewController.deleteReviewMeeting);

export default router;
