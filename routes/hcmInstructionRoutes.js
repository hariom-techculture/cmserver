// routes/hcmInstructionRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import * as hcmInstructionController from "../controllers/hcmInstructionController.js";

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
  hcmInstructionController.createHcmInstruction
);

router.get("/", hcmInstructionController.getAllHcmInstructions);
router.get("/status", hcmInstructionController.getHcmInstructionsByStatus);
router.get("/status-counts", hcmInstructionController.getHcmInstructionSummary);
router.get("/:id", hcmInstructionController.getHcmInstructionById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  hcmInstructionController.updateHcmInstruction
);

router.delete("/:id", hcmInstructionController.deleteHcmInstruction);

export default router;
