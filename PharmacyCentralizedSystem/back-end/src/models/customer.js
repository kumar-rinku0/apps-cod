import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "customer name is required."],
    },
    dob: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email address is required."],
      unique: [true, "email address already registered."],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    postalCode: {
      type: String,
      required: [true, "postal code is required."],
      unique: [true, "postal code is already registered."],
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
