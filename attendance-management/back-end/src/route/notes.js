import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  handleAddNoteByEmployeeWithAttandance,
  handleAddNoteByEmployee,
  handleAddNoteByAdmin,
  handleGetNotesByAttendance,
  handleGetNotesByUser,
} from "../controller/notes.js";
const route = Router();

// POST: Add note
route.route("/addbyemployee").post(wrapAsync(handleAddNoteByEmployee));

// POST: Add note with attandance
route
  .route("/addbyemployee/attandance")
  .post(wrapAsync(handleAddNoteByEmployee));

// POST: Add note by admin
route.route("/addbyadmin").post(wrapAsync(handleAddNoteByAdmin));

// GET: Get notes by attendanceId
route
  .route("/attendanceId/:attendanceId")
  .get(wrapAsync(handleGetNotesByAttendance));
// GET: Get notes by userId
route.route("/employeeId/:employeeId").get(wrapAsync(handleGetNotesByUser));

export default route;
