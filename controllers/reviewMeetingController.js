import ReviewMeeting from "../models/ReviewMeeting.js";
import mongoose from "mongoose";

export const createReviewMeetingWithFiles = async (req, res) => {
  try {
    const {
      subject,
      department,
      dateOfReview,
      keyTakeAways,
      district,
      details,
      dateOfMoMRelease,
      actionTaken,
      lastLogin,
    } = req.body;

    const count = await ReviewMeeting.countDocuments();
    const serialNo = `RM-${String(count + 1).padStart(4, "0")}`;

    const momUpload = req.files?.momFile?.[0]?.filename || null;
    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;

    const meeting = await ReviewMeeting.create({
      serialNo,
      subject,
      department,
      dateOfReview,
      keyTakeAways,
      district,
      details,
      dateOfMoMRelease,
      actionTaken,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
      momUpload,
      letterUpload,
      pictureUpload,
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllReviewMeetings = async (req, res) => {
  try {
    const meetings = await ReviewMeeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnnouncementsByStatus = async (req, res) => {
  try {
    const { district, department } = req.query;
    let { status } = req.query;

    const filter = {};

    if (status) {
      status = status
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      filter.status = status;
    }
    if (district) filter.district = district;
    if (department) filter.department = department;

    const announcements = await ReviewMeeting.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements by status:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching announcements" });
  }
};

// ✅ Get Review Meeting by ID
export const getReviewMeetingById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const meeting = await ReviewMeeting.findById(id);

    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Review Meeting not found" });
    }

    res.status(200).json({ success: true, meeting });
  } catch (error) {
    console.error("Error fetching Review Meeting by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Review Meeting by ID
export const updateReviewMeeting = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      serialNo,
      subject,
      department,
      dateOfReview,
      keyTakeAways,
      district,
      details,
      dateOfMoMRelease,
      actionTaken,
      lastLogin,
    } = req.body;

    // Handle uploaded files
    const momUpload = req.files?.momFile?.[0]?.filename;
    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;

    const updatedFields = {
      serialNo,
      subject,
      department,
      dateOfReview,
      keyTakeAways,
      district,
      details,
      dateOfMoMRelease,
      actionTaken,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (momUpload) updatedFields.momUpload = momUpload;
    if (letterUpload) updatedFields.letterUpload = letterUpload;
    if (pictureUpload) updatedFields.pictureUpload = pictureUpload;

    const updated = await ReviewMeeting.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Review Meeting not found" });
    }

    res.status(200).json({ success: true, meeting: updated });
  } catch (error) {
    console.error("Update Review Meeting error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Review Meeting by ID
export const deleteReviewMeeting = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Review Meeting ID" });
  }

  try {
    const meeting = await ReviewMeeting.findByIdAndDelete(id);

    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Review Meeting not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review Meeting deleted successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Delete Review Meeting error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
