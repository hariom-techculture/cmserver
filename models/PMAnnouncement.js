import mongoose from "mongoose";

const pmAnnouncementSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true, unique: true },
    announcementNo: { type: String, required: true, unique: true },
    dateOfAnnouncement: { type: Date, required: true },
    district: {
      type: String,
      required: true,
      enum: [
        /*... district list */
      ],
    },
    details: { type: String, required: true },
    department: {
      type: String,
      required: true,
      enum: [
        /*... department list */
      ],
    },
    dateOfCompletion: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Open", "Completed", "In Progress", "Pending"],
    },
    reason: { type: String, default: "" },
    letterUpload: { type: String, default: null },
    pictureUpload: { type: String, default: null },
    documentUpload: { type: String, default: null },

    lastLogin: { type: Date, default: null },
    reason: { type: String, default: "" },
    expectedCompletion: { type: Date, default: null },
  },
  { timestamps: true }
);

const PMAnnouncement = mongoose.model("PMAnnouncement", pmAnnouncementSchema);
export default PMAnnouncement;
