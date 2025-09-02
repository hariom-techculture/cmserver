import mongoose from "mongoose";
import NewInitiative from "../models/NewInitiative.js";

// Create New Initiative with file uploads
export const createNewInitiative = async (req, res) => {
  try {
    const { departmentName, date, initiativeName, details, status, lastLogin } =
      req.body;

    const count = await NewInitiative.countDocuments();
    const serialNo = `NI-${String(count + 1).padStart(4, "0")}`; // e.g., NI-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;

    const initiative = await NewInitiative.create({
      serialNo,
      departmentName,
      date: date ? new Date(date) : null,
      initiativeName,
      details,
      status,
      uploads: {
        letter: letterUpload,
        picture: pictureUpload,
      },
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    });

    res.status(201).json(initiative);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all initiatives with optional filters
export const getAllInitiatives = async (req, res) => {
  try {
    const { status, departmentName } = req.query;
    const filter = {};

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (departmentName) filter.departmentName = departmentName;

    const initiatives = await NewInitiative.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(initiatives);
  } catch (error) {
    console.error("Error fetching NewInitiatives:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching initiatives" });
  }
};

// Get initiative by ID
export const getInitiativeById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const initiative = await NewInitiative.findById(id);
    if (!initiative) {
      return res
        .status(404)
        .json({ success: false, message: "Initiative not found" });
    }

    res.status(200).json({ success: true, initiative });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Initiative
export const updateInitiative = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const { departmentName, date, initiativeName, details, status, lastLogin } =
      req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;

    const updatedFields = {
      departmentName,
      date: date ? new Date(date) : null,
      initiativeName,
      details,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (letterUpload) updatedFields["uploads.letter"] = letterUpload;
    if (pictureUpload) updatedFields["uploads.picture"] = pictureUpload;

    const updated = await NewInitiative.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Initiative not found" });
    }

    res.status(200).json({ success: true, initiative: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Initiative
export const deleteInitiative = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Initiative ID" });
  }

  try {
    const initiative = await NewInitiative.findByIdAndDelete(id);

    if (!initiative) {
      return res
        .status(404)
        .json({ success: false, message: "Initiative not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Initiative deleted successfully",
      data: initiative,
    });
  } catch (error) {
    console.error("deleteInitiative error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get initiatives by status with optional filters
export const getInitiativesByStatus = async (req, res) => {
  try {
    const { departmentName } = req.query;
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

    if (departmentName) filter.departmentName = departmentName;

    const initiatives = await NewInitiative.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(initiatives);
  } catch (error) {
    console.error("Error fetching initiatives by status:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching initiatives" });
  }
};

// Get New Initiative summary
export const getNewInitiativeSummary = async (req, res) => {
  try {
    const categories = ["New Initiatives"];
    const result = [];

    for (const category of categories) {
      const total = await NewInitiative.countDocuments();
      const implemented = await NewInitiative.countDocuments({
        status: "Implemented",
      });
      const inProgress = await NewInitiative.countDocuments({
        status: "In Progress",
      });
      const planning = await NewInitiative.countDocuments({
        status: "Planning",
      });
      const onHold = await NewInitiative.countDocuments({
        status: "On Hold",
      });

      const implementationRate =
        total > 0 ? Math.round((implemented / total) * 100) : 0;

      result.push({
        category: "B. " + category,
        total,
        implemented,
        inProgress,
        planning,
        onHold,
        implementationRate,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};
