import InnovativeProposal from "../models/InnovativeProposal.js";
import mongoose from "mongoose";
export const createProposalWithFiles = async (req, res) => {
  try {
    const {
      institutionName,
      dateOfSubmission,
      representativeName,
      representativeContact,
      district,
      details,
      departmentSubmitted,
      officerSubmitted,
      actionTaken,
      status,
      lastLogin,
    } = req.body;

    const count = await InnovativeProposal.countDocuments();
    const serialNo = `INN-${String(count + 1).padStart(4, "0")}`; // e.g., PM-0001

    const letterUpload = req.files?.letterFile?.[0]?.filename || null;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename || null;
    const documentUpload = req.files?.documentFile?.[0]?.filename || null;

    const proposal = await InnovativeProposal.create({
      serialNo,
      institutionName,
      dateOfSubmission,
      representative: {
        name: representativeName,
        contact: representativeContact,
      },
      district,
      details,
      departmentSubmitted,
      officerSubmitted,
      actionTaken,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
      letterUpload,
      pictureUpload,
      documentUpload,
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProposals = async (req, res) => {
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

    const announcements = await InnovativeProposal.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching InnovativeProposal:", error);
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

    const announcements = await InnovativeProposal.find(filter).sort({
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

export const getSummary = async (req, res) => {
  try {
    const categories = ["Innovative Proposals"];
    const result = [];

    for (const category of categories) {
      const total = await InnovativeProposal.countDocuments();
      const completed = await InnovativeProposal.countDocuments({
        status: "Completed",
      });
      const inProgress = await InnovativeProposal.countDocuments({
        status: "In Progress",
      });
      const pending = await InnovativeProposal.countDocuments({
        status: "Pending",
      });
      const delayed = await InnovativeProposal.countDocuments({
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
export const getInnovativeProposalById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const proposal = await InnovativeProposal.findById(id);
    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, proposal });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const updateInnovativeProposal = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ success: false, message: "Invalid ID" });
//   }

//   try {
//     const {
//       serialNo,
//       institutionName,
//       dateOfSubmission,
//       representativeName,
//       representativeContact,
//       district,
//       details,
//       departmentSubmitted,
//       officerSubmitted,
//       actionTaken,
//       status,
//       lastLogin,
//     } = req.body;

//     const letterUpload = req.files?.letterFile?.[0]?.filename;
//     const pictureUpload = req.files?.pictureFile?.[0]?.filename;

//     const updatedFields = {
//       serialNo,
//       institutionName,
//       dateOfSubmission,
//       representative: {
//         name: representativeName,
//         contact: representativeContact,
//       },
//       district,
//       details,
//       departmentSubmitted,
//       officerSubmitted,
//       actionTaken,
//       status,
//       lastLogin: lastLogin ? new Date(lastLogin) : null,
//     };

//     if (letterUpload) updatedFields.letterUpload = letterUpload;
//     if (pictureUpload) updatedFields.pictureUpload = pictureUpload;

//     const updated = await InnovativeProposal.findByIdAndUpdate(
//       id,
//       updatedFields,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Proposal not found" });
//     }

//     res.status(200).json({ success: true, proposal: updated });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Delete Proposal

export const updateInnovativeProposal = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const {
      serialNo,
      institutionName,
      dateOfSubmission,
      representativeName,
      representativeContact,
      district,
      details,
      departmentSubmitted,
      officerSubmitted,
      actionTaken,
      status,
      lastLogin,
    } = req.body;

    const letterUpload = req.files?.letterFile?.[0]?.filename;
    const pictureUpload = req.files?.pictureFile?.[0]?.filename;
    const documentUpload = req.files?.documentFile?.[0]?.filename;

    const updatedFields = {
      serialNo,
      institutionName,
      dateOfSubmission,
      representative: {
        name: representativeName,
        contact: representativeContact,
      },
      district,
      details,
      departmentSubmitted,
      officerSubmitted,
      actionTaken,
      status,
      lastLogin: lastLogin ? new Date(lastLogin) : null,
    };

    if (letterUpload) updatedFields.letterUpload = letterUpload;
    if (pictureUpload) updatedFields.pictureUpload = pictureUpload;
    if (documentUpload) updatedFields.documentUpload = documentUpload;

    const updated = await InnovativeProposal.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, proposal: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInnovativeProposal = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Proposal ID" });
  }

  try {
    const proposal = await InnovativeProposal.findByIdAndDelete(id);

    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Proposal deleted successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("deleteInnovativeProposal error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
