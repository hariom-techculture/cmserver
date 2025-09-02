// controllers/statementController.js
import mongoose from "mongoose";
import Statement from "../models/Statement.js";

// Create new Statement with file uploads
export const createStatement = async (req, res) => {
  try {
    const {
      mpMlaName,
      constituencyName,
      dateOfStatement,
      details,
      relatedDept,
      factualBrief,
      status,
      lastLogin,
    } = req.body;

    const count = await Statement.countDocuments();
    const serialNo = `ST-${String(count + 1).padStart(4, "0")}`; // e.g., ST-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;

    const statement = await Statement.create({
      serialNo,
      mpMlaName,
      constituencyName,
      dateOfStatement: dateOfStatement ? new Date(dateOfStatement) : null,
      details,
      relatedDept,
      factualBrief,
      status,
      uploads: {
        letter: letterUpload,
        picture: pictureUpload,
      },
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    });

    res.status(201).json(statement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Statements with optional filters
export const getAllStatements = async (req, res) => {
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

    const statements = await Statement.find(filter).sort({ createdAt: -1 });
    res.status(200).json(statements);
  } catch (error) {
    console.error("Error fetching Statements:", error);
    res.status(500).json({ message: "Server error while fetching statements" });
  }
};

// Get Statement by ID
export const getStatementById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const statement = await Statement.findById(id);
    if (!statement) {
      return res
        .status(404)
        .json({ success: false, message: "Statement not found" });
    }

    res.status(200).json({ success: true, statement });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Statement
export const updateStatement = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      mpMlaName,
      constituencyName,
      dateOfStatement,
      details,
      relatedDept,
      factualBrief,
      status,
      lastLogin,
    } = req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;

    const updatedFields = {
      mpMlaName,
      constituencyName,
      dateOfStatement: dateOfStatement ? new Date(dateOfStatement) : null,
      details,
      relatedDept,
      factualBrief,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (letterUpload) updatedFields["uploads.letter"] = letterUpload;
    if (pictureUpload) updatedFields["uploads.picture"] = pictureUpload;

    const updated = await Statement.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Statement not found" });
    }

    res.status(200).json({ success: true, statement: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Statement
export const deleteStatement = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Statement ID" });
  }

  try {
    const statement = await Statement.findByIdAndDelete(id);

    if (!statement) {
      return res
        .status(404)
        .json({ success: false, message: "Statement not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Statement deleted successfully",
      data: statement,
    });
  } catch (error) {
    console.error("deleteStatement error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Statements by status with optional filters
export const getStatementsByStatus = async (req, res) => {
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

    const statements = await Statement.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(statements);
  } catch (error) {
    console.error("Error fetching Statements by status:", error);
    res.status(500).json({ message: "Server error while fetching statements" });
  }
};

// Get Statement summary
export const getStatementSummary = async (req, res) => {
  try {
    const categories = ["Statements"];
    const result = [];

    for (const category of categories) {
      const total = await Statement.countDocuments();
      const published = await Statement.countDocuments({
        status: "Published",
      });
      const inProgress = await Statement.countDocuments({
        status: "In Progress",
      });
      const pending = await Statement.countDocuments({
        status: "Pending",
      });

      const publicationRate =
        total > 0 ? Math.round((published / total) * 100) : 0;

      result.push({
        category: "D. " + category,
        total,
        published,
        inProgress,
        pending,
        publicationRate,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Statement summary" });
  }
};
