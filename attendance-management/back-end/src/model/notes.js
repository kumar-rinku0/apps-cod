import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: {
      values: ["many", "one"],
      message: "invalid note type.",
    },
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sendBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sendByRole: {
    type: String,
    enum: {
      values: ["admin", "manager"],
      message: "invalied role asignment!",
    },
  },
  attendanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
