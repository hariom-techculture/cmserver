import mongoose from "mongoose";

const StateGovtSchemeSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true, unique: true },
    dateOfApproval: { type: Date, required: true },
    dateOfCompletion: { type: Date, required: true },
    district: {
      type: String,
      required: true,
      enum: [
        /*... district list */
      ],
    },
    department: { type: String, required: true },
    details: { type: String, required: true },
    numberOfBeneficiaries: { type: String, default: null },
    status: {
      type: String,
      required: true,
      enum: ["Open", "Completed", "In Progress", "Pending"],
    },
    letterUpload: { type: String, default: null },
    pictureUpload: { type: String, default: null },
    documentUpload: { type: String, default: null },
    lastLogin: { type: String, default: null },
    reason: { type: String, default: "" },
    expectedCompletion: { type: Date, default: null },
  },
  { timestamps: true }
);

const StateGovtScheme = mongoose.model(
  "StateGovtScheme",
  StateGovtSchemeSchema
);
export default StateGovtScheme;
