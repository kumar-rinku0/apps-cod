import { Schema, model } from "mongoose";
import { generateRandomString } from "../util/fuctions.js";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
      default: () => generateRandomString(5),
    },
    cinNo: String,
    gstNo: String,
    companyAddress: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);

export default Company;
