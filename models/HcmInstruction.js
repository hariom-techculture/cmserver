import mongoose from "mongoose";

const HcmInstructionSchema = new mongoose.Schema(
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
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
    },
    instructionsByHcm: {
      type: String,
      required: true,
    },
    actionByDepartment: {
      type: String,
      required: true,
    },
    dateOfCompletion: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Open", "Completed", "In Progress", "Pending"],
      required: true,
    },
    uploads: {
      letter: { type: String }, // file name/path
      picture: { type: String }, // file name/path (with geotagging)
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HcmInstruction", HcmInstructionSchema);
