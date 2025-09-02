import mongoose from "mongoose";

const innovativeProposalSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true },
    institutionName: { type: String, required: true },
    dateOfSubmission: { type: Date, required: true },
    representative: {
      name: { type: String, required: true },
      contact: { type: String, required: true },
    },
    district: { type: String, required: true },
    details: { type: String, required: true },
    departmentSubmitted: { type: String, required: true },
    officerSubmitted: { type: String, required: true },
    actionTaken: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Completed", "In Progress", "Pending"],
      required: true,
    },
    letterUpload: { type: String },
    pictureUpload: { type: String },
    documentUpload: { type: String, default: null },
    lastLogin: { type: String },
  },
  { timestamps: true }
);

const InnovativeProposal = mongoose.model(
  "InnovativeProposal",
  innovativeProposalSchema
);
export default InnovativeProposal;
