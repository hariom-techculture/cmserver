import mongoose from "mongoose";

const reviewMeetingSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true },
    subject: { type: String, required: true },
    department: { type: String, required: true },
    dateOfReview: { type: Date, required: true },
    keyTakeAways: { type: String, required: true },
    district: { type: String, required: true },
    details: { type: String, required: true },
    dateOfMoMRelease: { type: Date, required: true },
    momUpload: { type: String },
    actionTaken: { type: String, required: true },
    letterUpload: { type: String },
    pictureUpload: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const ReviewMeeting = mongoose.model("ReviewMeeting", reviewMeetingSchema);
export default ReviewMeeting;
