import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllCMAnnouncements,
  getAllPMAnnouncements,
  getAllGovtSchemes,
  getAllStateGovtSchemes,
  getAllInnovativeProposals,
  getAllReviewMeetings,
  getAllNewInitiatives,
  getAllHcmInstructions,
  getAllStatements,
  getAllCmHelplines,
} from "../controllers/deptuserController.js";
import { get } from "mongoose";

router.get("/cm", authMiddleware, getAllCMAnnouncements);
router.get("/pm", authMiddleware, getAllPMAnnouncements);
router.get("/central-schemes", authMiddleware, getAllGovtSchemes);
router.get("/state-schemes", authMiddleware, getAllStateGovtSchemes);
router.get("/innovative-proposals", authMiddleware, getAllInnovativeProposals);
router.get("/review-meetings", authMiddleware, getAllReviewMeetings);
router.get("/new-initiatives", authMiddleware, getAllNewInitiatives);
router.get("/hcm-instructions", authMiddleware, getAllHcmInstructions);
router.get("/statement", authMiddleware, getAllStatements);
router.get("/cm-helplines", authMiddleware, getAllCmHelplines);

export default router; // department user routes
