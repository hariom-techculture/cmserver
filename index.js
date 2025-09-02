import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import authAdminRoutes from "./routes/authAdminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cmRoutes from "./routes/cmAnnouncementRoutes.js";
import pmRoutes from "./routes/pmAnnouncementRoutes.js";
import centralGovtSchemeRoutes from "./routes/centralGovtSchemeRoutes.js";
import stateGovtSchemeRoutes from "./routes/stateGovtSchemeRoutes.js";
import innovativeProposalRoutes from "./routes/innovativeProposalRoutes.js";
import reviewMeetingRoutes from "./routes/reviewMeetingRoutes.js";
import aidedRoutes from "./routes/aidedDepartmentRoutes.js";
import govtRoutes from "./routes/govtDepartmentRoutes.js";
import publicRoutes from "./routes/publicUndertakingRoutes.js";
import imageSliderRoutes from "./routes/imageSliderRoutes.js";
import siteSettingRoutes from "./routes/siteSettingRoutes.js";
import deptUserRoutes from "./routes/deptUserRoutes.js";
import newInitiativeRoutes from "./routes/newInitiativeRoutes.js";
import hcmInstructionRoutes from "./routes/hcmInstructionRoutes.js";
import statementRoutes from "./routes/statementRoutes.js";
import cmHelplineRoutes from "./routes/cmHelplineRoutes.js";

// Setup __dirname manually (ESM doesn't provide it by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// app.use(
//   cors({
//     origin: [
//       "https://cmbhartidasboard.netlify.app",
//       "https://cmadmindashboard.netlify.app",
//     ], // frontend origin
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: ["http://157.245.105.212:3001", "http://157.245.105.212:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", authAdminRoutes);
app.use("/api/cm-announcements", cmRoutes);
app.use("/api/pm-announcements", pmRoutes);
app.use("/api/central-govt-schemes", centralGovtSchemeRoutes);
app.use("/api/state-govt-schemes", stateGovtSchemeRoutes);
app.use("/api/innovative-proposals", innovativeProposalRoutes);
app.use("/api/review-meetings", reviewMeetingRoutes);
app.use("/api/new-initiatives", newInitiativeRoutes);
app.use("/api/hcm-instructions", hcmInstructionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/departments/aided", aidedRoutes);
app.use("/api/departments/govt", govtRoutes);
app.use("/api/departments/public", publicRoutes);
app.use("/api/image-sliders", imageSliderRoutes);
app.use("/api/site-setting", siteSettingRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/cm-helplines", cmHelplineRoutes);

app.use("/api/deptUser", deptUserRoutes); // department user routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
