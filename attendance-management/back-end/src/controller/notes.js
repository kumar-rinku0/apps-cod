import Note from "../model/notes.js";
import { io } from "../service/socket.js";

// POST: Add a note on attandance
const handleAddNoteByEmployeeWithAttandance = async (req, res) => {
  const { attendanceId, content, employeeId } = req.body;
  const note = new Note({ attendanceId, content, type: "many", employeeId });
  await note.save();
  io.emit("new_note", note.content);
  return res
    .status(201)
    .json({ message: "Note added successfully", note: note });
};
// POST: Add a note on notes
const handleAddNoteByEmployee = async (req, res) => {
  const { content, employeeId } = req.body;
  const note = new Note({ content, type: "many", employeeId });
  await note.save();
  return res
    .status(201)
    .json({ message: "Note added successfully", note: note });
};

const handleAddNoteByAdmin = async (req, res) => {
  const { content, employeeId, sendBy } = req.body;
  const sendByRole = req.user.roleInfo.role;
  if (sendByRole && sendByRole === "empoyee") {
    return res.status(401).json({ message: "unauthorized activity!" });
  }
  const note = new Note({
    content,
    type: "one",
    sendBy,
    sendByRole,
    employeeId,
  });
  await note.save();
  return res
    .status(201)
    .json({ message: "Note added successfully", note: note });
};

// GET: Get notes by attendanceId
const handleGetNotesByAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const notes = await Note.find({ attendanceId }).sort({ createdAt: -1 });
  return res.status(200).json({ notes });
};

// GET: Get notes by userId
const handleGetNotesByUser = async (req, res) => {
  const { employeeId } = req.params;
  const notes = await Note.find({ employeeId })
    .populate("sendBy")
    .sort({ createdAt: -1 });
  return res.status(200).json({ notes });
};

export {
  handleAddNoteByEmployeeWithAttandance,
  handleAddNoteByEmployee,
  handleAddNoteByAdmin,
  handleGetNotesByAttendance,
  handleGetNotesByUser,
};
