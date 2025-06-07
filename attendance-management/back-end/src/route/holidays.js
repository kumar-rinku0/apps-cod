import express from "express";
import { handleCreateHoliday, handleGetHolidaysByYear } from "../controller/holidays.js";
import wrapAsync from "../util/wrap-async.js";

const router = express.Router();

router.route("/holidays").post(wrapAsync(handleCreateHoliday));
router.route("/holidays/:year").get(wrapAsync(handleGetHolidaysByYear));

export default router;
