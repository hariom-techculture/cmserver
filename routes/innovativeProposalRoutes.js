import express from "express";
import multer from "multer";
import path from "path";
import * as proposalController from "../controllers/innovativeProposalController.js";

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
  proposalController.createProposalWithFiles
);

router.get("/", proposalController.getAllProposals);
router.get("/status", proposalController.getAnnouncementsByStatus);
router.get("/status-counts", proposalController.getSummary);
router.get("/:id", proposalController.getInnovativeProposalById);
router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  proposalController.updateInnovativeProposal
);
router.delete("/:id", proposalController.deleteInnovativeProposal);

export default router;
