import express from "express";
import multer from "multer";
import path from "path";
import * as newInitiativeController from "../controllers/newInitiativeController.js";

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
  newInitiativeController.createNewInitiative
);

router.get("/", newInitiativeController.getAllInitiatives);
router.get("/status", newInitiativeController.getInitiativesByStatus);
router.get("/status-counts", newInitiativeController.getNewInitiativeSummary);
router.get("/:id", newInitiativeController.getInitiativeById);

router.put(
  "/:id",
  upload.fields([
    { name: "letterFile", maxCount: 1 },
    { name: "pictureFile", maxCount: 1 },
  ]),
  newInitiativeController.updateInitiative
);

router.delete("/:id", newInitiativeController.deleteInitiative);

export default router;
