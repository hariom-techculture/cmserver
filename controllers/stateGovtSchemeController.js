import StateGovtScheme from "../models/StateGovtScheme.js";

import mongoose from "mongoose";

export const createSchemeWithFiles = async (req, res) => {
  try {
    const {
      dateOfApproval,
      dateOfCompletion,
      district,
      department,
      details,
      numberOfBeneficiaries,
      status,
      lastLogin,
      reason,
      expectedCompletion,
    } = req.body;

    const count = await StateGovtScheme.countDocuments();
    const serialNo = `SGS-${String(count + 1).padStart(4, "0")}`; // e.g., PM-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;
    const documentUpload = req.files?.documentFile?.[0]?.filename || null;

    const scheme = await StateGovtScheme.create({
      serialNo,
      dateOfApproval,
      dateOfCompletion,
      district,
      department,
      details,
      numberOfBeneficiaries,
      status,
      lastLogin,
      letterUpload,
      pictureUpload,
      documentUpload,
      reason,
      expectedCompletion: expectedCompletion
        ? new Date(expectedCompletion)
        : null,
    });

    res.status(201).json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSchemes = async (req, res) => {
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

    const announcements = await StateGovtScheme.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching StateGovtScheme:", error);
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

    const announcements = await StateGovtScheme.find(filter).sort({
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

export const getStateAnnouncementSummary = async (req, res) => {
  try {
    const categories = ["State Govt Schemes"];
    const result = [];

    for (const category of categories) {
      const total = await StateGovtScheme.countDocuments();
      const completed = await StateGovtScheme.countDocuments({
        status: "Completed",
      });
      const inProgress = await StateGovtScheme.countDocuments({
        status: "In Progress",
      });
      const pending = await StateGovtScheme.countDocuments({
        status: "Pending",
      });
      const delayed = await StateGovtScheme.countDocuments({
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

// ...existing code...

export const getStateGovtSchemeById = async (req, res) => {
  const { id } = req.params;

  try {
    const scheme = await StateGovtScheme.findById(id);

    if (!scheme) {
      return res
        .status(404)
        .json({ success: false, message: "Scheme not found" });
    }

    res.status(200).json({ success: true, data: scheme });
  } catch (error) {
    console.error("Fetch single error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch scheme" });
  }
};

export const updateStateGovtScheme = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      serialNo,
      dateOfApproval,
      dateOfCompletion,
      district,
      department,
      details,
      numberOfBeneficiaries,
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
      dateOfApproval,
      dateOfCompletion,
      district,
      department,
      details,
      numberOfBeneficiaries,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
      reason,
      expectedCompletion: expectedCompletion
        ? new Date(expectedCompletion)
        : null,
    };

    if (letterUpload) updatedFields.letterUpload = letterUpload;
    if (pictureUpload) updatedFields.pictureUpload = pictureUpload;
    if (documentUpload) updatedFields.documentUpload = documentUpload;

    const updated = await StateGovtScheme.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Scheme not found" });
    }

    res.status(200).json({ success: true, scheme: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStateGovtScheme = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Scheme ID" });
  }

  try {
    const scheme = await StateGovtScheme.findByIdAndDelete(id);

    if (!scheme) {
      return res
        .status(404)
        .json({ success: false, message: "Scheme not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
      data: scheme,
    });
  } catch (error) {
    console.error("deleteStateGovtScheme error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
