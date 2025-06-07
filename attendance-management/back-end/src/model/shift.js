import { Schema, model } from "mongoose";

const shiftShema = new Schema({
  shiftType: {
    type: String,
    enum: {
      values: ["morning", "evening", "night"],
      message: "invailid shift!",
    },
  },
  shiftStartTime: {
    type: String,
    required: true,
  },
  shiftEndTime: {
    type: String,
    required: true,
  },
  workDays: {
    type: {
      Monday: Boolean,
      Tuesday: Boolean,
      Wednesday: Boolean,
      Thursday: Boolean,
      Friday: Boolean,
      Saturday: Boolean,
      Sunday: Boolean,
    },
    required: true,
  },
  halfDayLateBy: {
    type: Number,
    default: 30,
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const Shift = model("Shift", shiftShema);

export default Shift;
