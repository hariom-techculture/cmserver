import mongoose from "mongoose";
import CMAnnouncement from "../models/CMAnnouncement.js";
import PMAnnouncement from "../models/PMAnnouncement.js";
import CentralGovtScheme from "../models/CentralGovtScheme.js";
import StateGovtScheme from "../models/StateGovtScheme.js";
import InnovativeProposal from "../models/InnovativeProposal.js";
import ReviewMeeting from "../models/ReviewMeeting.js";
import NewInitiative from "../models/NewInitiative.js";
import HcmInstruction from "../models/HcmInstruction.js";
import Statement from "../models/Statement.js";
import CmHelpline from "../models/CmHelpline.js";

// Get all CM announcements for department users
export const getAllCMAnnouncements = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      department: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

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
// Fetch PM announcements with department filtering

export const getAllPMAnnouncements = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      department: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const announcements = await PMAnnouncement.find(filter).sort({
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

export const getAllGovtSchemes = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      department: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const schemes = await CentralGovtScheme.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching Central Govt Schemes:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
};

export const getAllStateGovtSchemes = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      department: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const schemes = await StateGovtScheme.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching State Govt Schemes:", error);
    res.status(500).json({ message: "Server error while fetching schemes" });
  }
};

export const getAllInnovativeProposals = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      departmentSubmitted: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const proposals = await InnovativeProposal.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching Innovative Proposals:", error);
    res.status(500).json({ message: "Server error while fetching proposals" });
  }
};

export const getAllReviewMeetings = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      department: userDept, // enforce filtering by authenticated user's department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const meetings = await ReviewMeeting.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching Review Meetings:", error);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
};

// Fetch New Initiatives with department filtering
export const getAllNewInitiatives = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      departmentName: userDept, // ✅ FIXED
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const initiatives = await NewInitiative.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(initiatives);
  } catch (error) {
    console.error("Error fetching New Initiatives:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching initiatives" });
  }
};


// Fetch HCM Instructions with department filtering
export const getAllHcmInstructions = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      departmentName: userDept, // ✅ enforce logged-in dept
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const instructions = await HcmInstruction.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(instructions);
  } catch (error) {
    console.error("Error fetching HCM Instructions:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching instructions" });
  }
};


// Fetch Statements with department filtering
export const getAllStatements = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      relatedDept: userDept, // ✅ enforce logged-in department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const statements = await Statement.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(statements);
  } catch (error) {
    console.error("Error fetching Statements:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching statements" });
  }
};


// Fetch CM Helpline records with department filtering
export const getAllCmHelplines = async (req, res) => {
  try {
    const { status, district, department: requestedDept } = req.query;

    // Get department from authenticated user (from JWT)
    const userDept = req.user?.deptName;

    if (!userDept) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No department info in token" });
    }

    // If department is provided in query, it must match token
    if (
      requestedDept &&
      requestedDept.toLowerCase() !== userDept.toLowerCase()
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot access other department's data" });
    }

    const filter = {
      relatedDept: userDept, // ✅ enforce filtering by logged-in department
    };

    if (status) {
      filter.status = status
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    if (district) filter.district = district;

    const cmHelplines = await CmHelpline.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(cmHelplines);
  } catch (error) {
    console.error("Error fetching CM Helplines:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching CM Helplines" });
  }
};

