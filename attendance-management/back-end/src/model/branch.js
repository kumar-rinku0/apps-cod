import { Schema, model } from "mongoose";

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    branchAddress: {
      type: String,
      required: true,
    },
    attendanceRadius: {
      type: Number,
      required: true,
    },
    branchGeometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

branchSchema.index({ branchGeometry: "2dsphere" });

const Branch = model("Branch", branchSchema);

export default Branch;
