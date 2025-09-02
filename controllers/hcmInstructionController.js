// controllers/hcmInstructionController.js
import mongoose from "mongoose";
import HcmInstruction from "../models/HcmInstruction.js";

// Create new HCM Instruction with file uploads
export const createHcmInstruction = async (req, res) => {
  try {
    const {
      dateOfReview,
      departmentName,
      details,
      instructionsByHcm,
      actionByDepartment,
      dateOfCompletion,
      status,
      lastLogin,
    } = req.body;

    const count = await HcmInstruction.countDocuments();
    const serialNo = `HCM-${String(count + 1).padStart(4, "0")}`; // e.g., HCM-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;

    const instruction = await HcmInstruction.create({
      serialNo,
      dateOfReview: dateOfReview ? new Date(dateOfReview) : null,
      departmentName,
      details,
      instructionsByHcm,
      actionByDepartment,
      dateOfCompletion: dateOfCompletion ? new Date(dateOfCompletion) : null,
      status,
      uploads: {
        letter: letterUpload,
        picture: pictureUpload,
      },
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    });

    res.status(201).json(instruction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all HCM Instructions with optional filters
export const getAllHcmInstructions = async (req, res) => {
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

    const instructions = await HcmInstruction.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(instructions);
  } catch (error) {
    console.error("Error fetching HcmInstructions:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching instructions" });
  }
};

// Get HCM Instruction by ID
export const getHcmInstructionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const instruction = await HcmInstruction.findById(id);
    if (!instruction) {
      return res
        .status(404)
        .json({ success: false, message: "Instruction not found" });
    }

    res.status(200).json({ success: true, instruction });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update HCM Instruction
export const updateHcmInstruction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      dateOfReview,
      departmentName,
      details,
      instructionsByHcm,
      actionByDepartment,
      dateOfCompletion,
      status,
      lastLogin,
    } = req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;

    const updatedFields = {
      dateOfReview: dateOfReview ? new Date(dateOfReview) : null,
      departmentName,
      details,
      instructionsByHcm,
      actionByDepartment,
      dateOfCompletion: dateOfCompletion ? new Date(dateOfCompletion) : null,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (letterUpload) updatedFields["uploads.letter"] = letterUpload;
    if (pictureUpload) updatedFields["uploads.picture"] = pictureUpload;

    const updated = await HcmInstruction.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Instruction not found" });
    }

    res.status(200).json({ success: true, instruction: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete HCM Instruction
export const deleteHcmInstruction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Instruction ID" });
  }

  try {
    const instruction = await HcmInstruction.findByIdAndDelete(id);

    if (!instruction) {
      return res
        .status(404)
        .json({ success: false, message: "Instruction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Instruction deleted successfully",
      data: instruction,
    });
  } catch (error) {
    console.error("deleteHcmInstruction error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get HCM Instructions by status with optional filters
export const getHcmInstructionsByStatus = async (req, res) => {
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

    const instructions = await HcmInstruction.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(instructions);
  } catch (error) {
    console.error("Error fetching HCM Instructions by status:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching instructions" });
  }
};

// Get HCM Instruction summary
export const getHcmInstructionSummary = async (req, res) => {
  try {
    const categories = ["HCM Instructions"];
    const result = [];

    for (const category of categories) {
      const total = await HcmInstruction.countDocuments();
      const completed = await HcmInstruction.countDocuments({
        status: "Completed",
      });
      const inProgress = await HcmInstruction.countDocuments({
        status: "In Progress",
      });
      const pending = await HcmInstruction.countDocuments({
        status: "Pending",
      });

      const completionRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      result.push({
        category: "C. " + category,
        total,
        completed,
        inProgress,
        pending,
        completionRate,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch HCM Instruction summary" });
  }
};
