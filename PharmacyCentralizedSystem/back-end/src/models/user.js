import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import Pharmacy from "./pharmacy.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "full name is required"],
    },
    email: {
      type: String,
      required: [true, "email address already registered."],
      unique: [true, "email address already registered."],
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          if (typeof value !== "string") return false;
          return value.length > 7;
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    username: {
      type: String,
      default: () => `user-${Date.now()}`,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "inactive"],
        message: "invailid status assignment!",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "admin*", "pharmacist"],
        message: "invalid role assignment!",
      },
      default: "admin",
      required: true,
    },
    verifyToken: String,
    verifyTokenExpire: Date,
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hexcode = await bcrypt.hash(this.password.trim(), salt);
    this.password = hexcode;
  }
  return next();
});

userSchema.post("findOneAndDelete", async function (doc, next) {
  const email = doc.email;
  console.log(email);
  const info = await Pharmacy.deleteMany({ createdBy: doc._id });
  console.log(info);
  return next();
});

const User = model("User", userSchema);

export default User;
