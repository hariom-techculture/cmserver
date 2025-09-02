// models/Statement.js
import mongoose from "mongoose";

const statementSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
      unique: true,
    },
    mpMlaName: {
      type: String,
      required: true,
      trim: true,
    },
    constituencyName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfStatement: {
      type: Date,
      required: true,
    },
    details: {
      type: String,
      trim: true,
    },
    relatedDept: {
      type: String,
      trim: true,
    },
    factualBrief: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Published", "In Progress", "Pending"],
      required: true,
    },
    uploads: {
      letter: { type: String, default: null }, // file path for letter upload
      picture: { type: String, default: null }, // file path for picture upload
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Statement = mongoose.model("Statement", statementSchema);

export default Statement;
