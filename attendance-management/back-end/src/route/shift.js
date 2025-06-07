import express from "express";
import wrapAsync from "../util/wrap-async.js";
import {
  getAllShifts,
  getShiftByEmployeeId,
  handleCreateShifts,
} from "../controller/shift.js";

const router = express.Router();

router.get("/all", wrapAsync(getAllShifts));
router.post("/create", wrapAsync(handleCreateShifts));
router.get("/:employeeId", wrapAsync(getShiftByEmployeeId));

export default router;
