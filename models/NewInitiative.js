import mongoose from "mongoose";

const newInitiativeSchema = new mongoose.Schema(
  {
    serialNo: { type: String, required: true }, // S.No
    departmentName: { type: String, required: true }, // Name of the Department
    date: { type: Date, required: true }, // Date
    initiativeName: { type: String, required: true }, // Initiative Name
    details: { type: String, required: true }, // Details
    status: {
      type: String,
      enum: ["Open", "Implemented", "In Progress", "Planning", "On Hold"],
      required: true,
    }, // Status
    uploads: {
      letter: { type: String }, // Letter file path
      picture: { type: String }, // Picture file path (with geotagging info if stored)
    }, // Uploads (Letter + Picture)
    lastLogin: { type: Date }, // Last login by the department
  },
  { timestamps: true }
);

const NewInitiative = mongoose.model("NewInitiative", newInitiativeSchema);
export default NewInitiative;
