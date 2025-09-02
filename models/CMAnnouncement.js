import mongoose from "mongoose";
// testing cm model
const cmAnnouncementSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true, unique: true },
    announcementNo: { type: String, required: true, unique: true },
    dateOfAnnouncement: { type: Date, required: true },
    district: {
      type: String,
      required: true,
      enum: [
        /*... same list as above */
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
      // open changes
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

const CMAnnouncement = mongoose.model("CMAnnouncement", cmAnnouncementSchema);
export default CMAnnouncement;
