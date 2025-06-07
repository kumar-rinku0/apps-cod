import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: {
      type: String,
      enum: [
        "Casual Leave",
        "Sick Leave",
        "Annual Leave",
        "Maternity/Paternity",
      ],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    halfDay: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    requestedOn: {
      type: Date,
      default: Date.now(),
    },
    approvedOn: {
      type: Date,
      default: Date.now(),
    },
    rejectedOn: {
      type: Date,
      default: Date.now(),
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Leaves = mongoose.model("Leave", LeaveSchema);

export default Leaves;
