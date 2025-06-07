import express from "express";
import multer from "multer";
import wrapAsync from "../util/wrap-async.js";
import {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendance,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetAttendanceCount,
  handleUpdateAttandance,
  handleUpdatePunchInInformation,
  handleUpdatePunchOutInformation,
} from "../controller/attendance.js";
import { handleUploadImage } from "../util/cloud-init.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/mark")
  .post(
    upload.single("punchInPhoto"),
    wrapAsync(handleUploadImage),
    wrapAsync(handlemarkPunchIn)
  );
router
  .route("/mark")
  .put(
    upload.single("punchOutPhoto"),
    wrapAsync(handleUploadImage),
    wrapAsync(handlemarkPunchOut)
  );

router.route("/update").patch(wrapAsync(handleUpdateAttandance));
router
  .route("/users/information/today")
  .post(wrapAsync(handleGetOneSpecificUserAttendance));

router
  .route("/attendancebyid/:attendanceId")
  .get(wrapAsync(handleGetOneSpecificDateAttendance));

router
  .route("/month/information")
  .post(wrapAsync(handleGetOneSpecificMonthAttendance));

router.route("/count/:companyId").get(wrapAsync(handleGetAttendanceCount));
router.route("/update/intime").post(wrapAsync(handleUpdatePunchInInformation));
router
  .route("/update/outtime")
  .post(wrapAsync(handleUpdatePunchOutInformation));

// File upload route
router
  .route("/upload")
  .post(upload.single("punchInPhoto"), wrapAsync(handleUploadImage));

export default router;
