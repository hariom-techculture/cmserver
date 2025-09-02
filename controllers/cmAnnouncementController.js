import CMAnnouncement from "../models/CMAnnouncement.js";
import mongoose from "mongoose";

export const createCMAnnouncementWithFiles = async (req, res) => {
  try {
    const {
      announcementNo,
      dateOfAnnouncement,
      district,
      details,
      department,
      dateOfCompletion,
      status,
      lastLogin,
      reason,
      expectedCompletion,
    } = req.body;
    const count = await CMAnnouncement.countDocuments();
    const serialNo = `CM-${String(count + 1).padStart(4, "0")}`;

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;
    const documentUpload = req.files?.documentFile?.[0]?.filename || null;

    const announcement = await CMAnnouncement.create({
      serialNo,
      announcementNo,
      dateOfAnnouncement,
      district,
      details,
      department,
      dateOfCompletion,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
      letterUpload,
      pictureUpload,
      documentUpload,
      reason,
      expectedCompletion: expectedCompletion
        ? new Date(expectedCompletion)
        : null,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCMAnnouncements = async (req, res) => {
  try {
    const { status, district, department } = req.query;
    const filter = {};

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;
    if (department) filter.department = department;

    const announcements = await CMAnnouncement.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching CM announcements:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching announcements" });
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

    const announcements = await CMAnnouncement.find(filter).sort({
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

export const getCMAnnouncementSummary = async (req, res) => {
  try {
    const categories = ["CM Announcements"];
    const result = [];

    for (const category of categories) {
      const total = await CMAnnouncement.countDocuments();
      const completed = await CMAnnouncement.countDocuments({
        status: "Completed",
      });
      const inProgress = await CMAnnouncement.countDocuments({
        status: "In Progress",
      });
      const pending = await CMAnnouncement.countDocuments({
        status: "Pending",
      });
      const delayed = await CMAnnouncement.countDocuments({
        status: "Delayed",
      });

      const completionRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      result.push({
        category: "A. " + category,
        total,
        completed,
        inProgress,
        pending,
        delayed,
        completionRate,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

export const getCMAnnouncementById = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await CMAnnouncement.findById(id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error("Fetch single error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch announcement" });
  }
};

export const updateCMAnnouncement = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      serialNo,
      announcementNo,
      dateOfAnnouncement,
      district,
      details,
      department,
      dateOfCompletion,
      status,
      lastLogin,
      reason,
      expectedCompletion,
    } = req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;
    const documentUpload = req.files?.documentFile?.[0]?.filename;

    const updatedFields = {
      serialNo,
      announcementNo,
      dateOfAnnouncement,
      district,
      details,
      department,
      dateOfCompletion,
      status,
      lastLogin: new Date(), // Always update to current timestamp

      reason, // ✅
      expectedCompletion: expectedCompletion
        ? new Date(expectedCompletion)
        : null,
    };

    if (letterUpload) updatedFields.letterUpload = letterUpload;
    if (pictureUpload) updatedFields.pictureUpload = pictureUpload;
    if (documentUpload) updatedFields.documentUpload = documentUpload;

    const updated = await CMAnnouncement.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    function formatDateReadable(dateStr) {
      return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date(dateStr));
    }

    res.status(200).json({
      success: true,
      announcement: updated,
      readableLastLogin: formatDateReadable(updated.lastLogin),
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCMAnnouncement = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid CM Announcement ID" });
  }

  try {
    const announcement = await CMAnnouncement.findByIdAndDelete(id);

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "CM Announcement not found" });
    }

    return res.status(200).json({
      success: true,
      message: "CM Announcement deleted successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("deleteCMAnnouncement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
