import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  departmentType: {
    type: String,
    enum: ["Govt", "Aided", "Public"],
    default: "Govt",
  },
  department: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "departmentTypeRef",
  },
  departmentTypeRef: {
    type: String,
    required: true,
    enum: ["GovtDept", "AidedDept", "PublicUndertaking"],
    default: "GovtDept",
  },
  active: {
    type: Boolean,
    default: true,
  },
  userType: {
    type: String,
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("UserAdmin", userSchema);
export default UserModel;
