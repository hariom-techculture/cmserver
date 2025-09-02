import mongoose from "mongoose";

const centralGovtSchemeSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true, unique: true },
    announcementNo: {
      type: String,

      sparse: true, // (optional fix, see below)
    },
    dateOfApproval: { type: Date, required: true },
    dateOfCompletion: { type: Date, required: true },
    district: {
      type: String,
      required: true,
      enum: [
        // "Almora",
        // "Bageshwar",
        // "Chamoli",
        // "Champawat",
        // "Dehradun",
        // "Haridwar",
        // "Nainital",
        // "Pauri Garhwal",
        // "Pithoragarh",
        // "Rudraprayag",
        // "Tehri Garhwal",
        // "Udham Singh Nagar",
        // "Uttarkashi",
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

const CentralGovtScheme = mongoose.model(
  "CentralGovtScheme",
  centralGovtSchemeSchema
);
export default CentralGovtScheme;
