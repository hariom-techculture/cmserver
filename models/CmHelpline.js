// models/CmHelpline.js
import mongoose from "mongoose";

const cmHelplineSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfReview: {
      type: Date,
      required: true,
    },
    pendingDetails: {
      type: String,
      required: true,
    },
    periodOfPendency: {
      type: Number, // in days
      required: true,
    },
    relatedDept: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved", "In Progress", "Pending"],
      required: true,
    },
    reasonForDelay: {
      type: String,
    },
    reviewAtDivisionalLevel: {
      type: String,
      enum: ["Yes", "No"],
      default: "Pending",
    },
    reviewAtCsLevel: {
      type: String,
      enum: ["Yes", "No"],
      default: "Pending",
    },
    outcomeOfReview: {
      type: String,
    },
    actionOnDefaulter: {
      type: String,
    },
    uploads: {
      letter: { type: String },
      picture: { type: String },
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CmHelpline", cmHelplineSchema);
