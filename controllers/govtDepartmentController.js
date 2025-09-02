import GovtDeptModel from "../models/GovtDepartment.js";
// import { IncomingForm } from "formidable";
import { uploadImages } from "../utils/ImageUpload.js"; // Your cloudinary upload function
import mongoose from "mongoose";

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await GovtDeptModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ departments, success: true });
  } catch (error) {
    console.error("GET /departments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, language } = req.body;

    if (!name || !language) {
      return res
        .status(400)
        .json({ success: false, message: "Name and language are required" });
    }

    let mainImgUrl = null;

    // if (req.files && req.files.length > 0) {
    //   const uploadResult = await uploadImages(req);
    //   if (uploadResult.images.length > 0) {
    //     mainImgUrl = uploadResult.images[0];
    //   }
    // }

    // if (req.files && req.files.mainImg && req.files.mainImg.length > 0) {
    //   const uploadResult = await uploadImages(req);
    //   if (uploadResult.images.length > 0) {
    //     mainImgUrl = uploadResult.images[0];
    //   }
    // }
    if (req.files && req.files.mainImg && req.files.mainImg.length > 0) {
      const uploadedFile = req.files.mainImg[0]; // multer puts uploaded file info here
      mainImgUrl = `${process.env.BASE_URL}/uploads/${uploadedFile.filename}`; // make sure BASE_URL is defined
    }

    const department = await GovtDeptModel.create({
      name,
      language,
      mainImg: mainImgUrl,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
  console.log("📂 Files received:", req.files);
  console.log("📝 Body received:", req.body);
};

export const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const department = await GovtDeptModel.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Get by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const { name, language, existingMainImg } = req.body;

    if (!name || !language) {
      return res
        .status(400)
        .json({ success: false, message: "Name and language are required" });
    }

    let mainImgUrl = existingMainImg || null;

    // if (req.files && req.files.length > 0) {
    //   const uploadResult = await uploadImages(req);
    //   if (uploadResult.images.length > 0) {
    //     mainImgUrl = uploadResult.images[0];
    //   }
    // }

    if (req.files && req.files.mainImg && req.files.mainImg.length > 0) {
      const uploadedFile = req.files.mainImg[0];
      mainImgUrl = `${process.env.BASE_URL}/uploads/${uploadedFile.filename}`;
    }

    const updated = await GovtDeptModel.findByIdAndUpdate(
      id,
      { name, language, mainImg: mainImgUrl },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, department: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid department ID" });
  }

  try {
    const department = await GovtDeptModel.findByIdAndDelete(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    // No need to delete local images since using Cloudinary, but if you want, you can delete Cloudinary images here with public_id.

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      department,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
