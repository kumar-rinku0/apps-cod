import mongoose from "mongoose";

const { Schema } = mongoose;

// Company Schema
const CompanySchema = new Schema({
  name: { type: String, required: true },
});

// Branch Schema
const BranchSchema = new Schema({
  name: { type: String, required: true },
});

// Register Company and Branch models if not already registered
const Company = mongoose.models.Company || mongoose.model("Company", CompanySchema);
const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);

// Subdocument schema for roles with company and branch references
const CompanyWithRoleSchema = new Schema({
  role: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
});

// User Schema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    lastActive: { type: Date },
    companyWithRole: [CompanyWithRoleSchema],
  },
  {
    timestamps: true,
  }
);

// Register User model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;