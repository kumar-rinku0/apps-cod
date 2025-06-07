import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import User from "./user.js";

const pharmacySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: {
    type: String,
    required: [true, "email address is required for pharmacy!"],
    unique: [true, "email address is already registered!"],
    validate: {
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
  },
  address: String,
  domain: String,
  logo: String,
  owner: {
    type: String,
    required: true,
  },
  postalCode: String,
  registrationNumber: {
    type: String,
    required: [true, "registration number is required for pharmacy!"],
    unique: [true, "a pharmacy already registered with same registration id."],
  },
  establistedAt: String,
  licenceKey: {
    type: String,
    required: true,
    unique: [true, "key has to be unique"],
    default: () => getLicenceKey(),
  },
  licenceExpiry: {
    type: Date,
    required: [true, "licence expiry doesn't exist!"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required to create pharmacy!"],
  },
});

pharmacySchema.post("findOneAndDelete", async function (doc, next) {
  console.log(doc.createdBy);
  const info = await User.findByIdAndDelete(doc.createdBy);
  console.log(info);
  return next();
});

const Pharmacy = model("Pharmacy", pharmacySchema);

export default Pharmacy;

const getLicenceKey = () => {
  return randomUUID().split("-").join("");
};
