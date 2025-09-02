// controllers/cmHelplineController.js
import mongoose from "mongoose";
import CmHelpline from "../models/CmHelpline.js";

// Create new CM Helpline record with file uploads
export const createCmHelpline = async (req, res) => {
  try {
    const {
      dateOfReview,
      pendingDetails,
      periodOfPendency,
      relatedDept,
      status,
      reasonForDelay,
      reviewAtDivisionalLevel,
      reviewAtCsLevel,
      outcomeOfReview,
      actionOnDefaulter,
      lastLogin,
    } = req.body;

    const count = await CmHelpline.countDocuments();
    const serialNo = `CMH-${String(count + 1).padStart(4, "0")}`; // e.g., CMH-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;

    const cmHelpline = await CmHelpline.create({
      serialNo,
      dateOfReview: dateOfReview ? new Date(dateOfReview) : null,
      pendingDetails,
      periodOfPendency,
      relatedDept,
      status,
      reasonForDelay,
      reviewAtDivisionalLevel,
      reviewAtCsLevel,
      outcomeOfReview,
      actionOnDefaulter,
      uploads: {
        letter: letterUpload,
        picture: pictureUpload,
      },
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    });

    res.status(201).json(cmHelpline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all CM Helpline records with optional filters
export const getAllCmHelplines = async (req, res) => {
  try {
    const { status, relatedDept } = req.query;
    const filter = {};

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (relatedDept) filter.relatedDept = relatedDept;

    const cmHelplines = await CmHelpline.find(filter).sort({ createdAt: -1 });
    res.status(200).json(cmHelplines);
  } catch (error) {
    console.error("Error fetching CM Helplines:", error);
    res.status(500).json({ message: "Server error while fetching records" });
  }
};

// Get CM Helpline by ID
export const getCmHelplineById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const cmHelpline = await CmHelpline.findById(id);
    if (!cmHelpline) {
      return res
        .status(404)
        .json({ success: false, message: "CM Helpline record not found" });
    }

    res.status(200).json({ success: true, cmHelpline });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update CM Helpline record
export const updateCmHelpline = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      dateOfReview,
      pendingDetails,
      periodOfPendency,
      relatedDept,
      status,
      reasonForDelay,
      reviewAtDivisionalLevel,
      reviewAtCsLevel,
      outcomeOfReview,
      actionOnDefaulter,
      lastLogin,
    } = req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;

    const updatedFields = {
      dateOfReview: dateOfReview ? new Date(dateOfReview) : null,
      pendingDetails,
      periodOfPendency,
      relatedDept,
      status,
      reasonForDelay,
      reviewAtDivisionalLevel,
      reviewAtCsLevel,
      outcomeOfReview,
      actionOnDefaulter,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (letterUpload) updatedFields["uploads.letter"] = letterUpload;
    if (pictureUpload) updatedFields["uploads.picture"] = pictureUpload;

    const updated = await CmHelpline.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "CM Helpline record not found" });
    }

    res.status(200).json({ success: true, cmHelpline: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete CM Helpline record
export const deleteCmHelpline = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid CM Helpline ID" });
  }

  try {
    const cmHelpline = await CmHelpline.findByIdAndDelete(id);

    if (!cmHelpline) {
      return res
        .status(404)
        .json({ success: false, message: "CM Helpline record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "CM Helpline record deleted successfully",
      data: cmHelpline,
    });
  } catch (error) {
    console.error("deleteCmHelpline error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get CM Helplines by status with optional filters
export const getCmHelplinesByStatus = async (req, res) => {
  try {
    const { relatedDept } = req.query;
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

    if (relatedDept) filter.relatedDept = relatedDept;

    const cmHelplines = await CmHelpline.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(cmHelplines);
  } catch (error) {
    console.error("Error fetching CM Helplines by status:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching CM Helplines" });
  }
};

// Get CM Helpline summary
export const getCmHelplineSummary = async (req, res) => {
  try {
    const categories = ["CM Helpline"];
    const result = [];

    for (const category of categories) {
      const total = await CmHelpline.countDocuments();
      const resolved = await CmHelpline.countDocuments({
        status: "Resolved",
      });
      const inProgress = await CmHelpline.countDocuments({
        status: "In Progress",
      });
      const pending = await CmHelpline.countDocuments({
        status: "Pending",
      });

      const resolutionRate =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      result.push({
        category: "E. " + category,
        total,
        resolved,
        inProgress,
        pending,
        resolutionRate,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CM Helpline summary" });
  }
};
