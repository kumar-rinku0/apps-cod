import { PunchIn, PunchOut, Attendance } from "../model/attendance.js";
import {
  formatDateAndTime,
  formatDateForComparison,
} from "../util/fuctions.js";
import { reverseGeocode } from "../util/fuctions.js";

const handlemarkPunchIn = async (req, res) => {
  const { userId, companyId, branchId, punchInGeometry } = req.body;
  if (!req.url) {
    return res.json({ message: "file not found." });
  }
  const punchInPhoto = req.url;
  const date = formatDateForComparison(new Date());
  const month = new Date().toLocaleString("en-IN", {
    month: "long",
  });
  const punchInAddress = await reverseGeocode(
    punchInGeometry.coordinates[1],
    punchInGeometry.coordinates[0]
  );
  const punchIn = new PunchIn({
    punchInGeometry,
    punchInAddress,
    punchInPhoto,
  });
  await punchIn.save();
  const prevAttendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  if (prevAttendance) {
    prevAttendance.punchingInfo.push({ punchInInfo: punchIn });
    await prevAttendance.save();

    return res.status(201).json({ message: "punched in!", punchIn: punchIn });
  }
  const attendance = new Attendance({
    userId,
    companyId,
    branchId,
    date,
    month,
  });
  attendance.punchingInfo.push({ punchInInfo: punchIn });
  await attendance.save();

  return res.status(201).json({ message: "punched in!", punchIn: punchIn });
};

const handlemarkPunchOut = async (req, res) => {
  const { userId, companyId, branchId, punchOutGeometry } = req.body;
  if (!req.url) {
    return res.json({ message: "file not found." });
  }
  const punchOutPhoto = req.url;
  const punchOutAddress = await reverseGeocode(
    punchOutGeometry.coordinates[1],
    punchOutGeometry.coordinates[0]
  );
  const punchOut = new PunchOut({
    punchOutGeometry,
    punchOutAddress,
    punchOutPhoto,
  });
  await punchOut.save();
  const date = formatDateForComparison(new Date());

  const attendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  const lastPunchInInfo = attendance.punchingInfo.pop();
  lastPunchInInfo.punchOutInfo = punchOut;
  attendance.punchingInfo.push(lastPunchInInfo);
  await attendance.save();

  res.status(201).json({
    message: "punched out!",
    punchOut: punchOut,
    attendance: attendance,
  });
};

const handleUpdateAttandance = async (req, res) => {
  const { date, month, status, attendanceId, userId, branchId, companyId } =
    req.body;
  const user = req.user;
  if (user.roleInfo.role === "employee") {
    return res.status(401).json({ message: "unauthorized for action." });
  }
  if (attendanceId) {
    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { status },
      { new: true }
    );
    if (!attendance) {
      return res.status(400).json({ message: "invalid attendance id." });
    }
    return res.status(200).json({ message: "attendance status updated." });
  }
  const attendance = new Attendance({
    userId,
    branchId,
    companyId,
    status,
    date,
    month,
  });
  await attendance.save();
  return res.status(200).json({ message: "attandance created." });
};

const handleCreateAttandance = async (req, res) => {};

// Get All Attendance Records
const handleGetOneSpecificUserAttendance = async (req, res) => {
  const { userId, companyId, branchId } = req.body;
  const date = formatDateForComparison(new Date());

  const attendance = await Attendance.findOne({
    $and: [
      { date: date, companyId: companyId, userId: userId, branchId: branchId },
    ],
  });
  if (!attendance) {
    return res.status(200).json({
      message: "user isn't punched in yet!",
      lastPuchedOut: true,
    });
  }
  if (attendance && attendance.punchingInfo.length === 0) {
    return res.status(200).json({
      message: "info doesnt exist!",
      lastPuchedOut: true,
    });
  }
  const lastPunchingInfo = attendance.punchingInfo.pop();
  let lastPuchedOut = false;
  if (lastPunchingInfo.punchOutInfo) {
    lastPuchedOut = true;
  }
  return res.status(200).json({
    message: "user already punched in!",
    lastPunchingInfo: lastPunchingInfo,
    lastPuchedOut: lastPuchedOut,
    attendance: attendance,
  });
};

const handleGetOneSpecificMonthAttendance = async (req, res) => {
  const { userId, companyId, branchId, month } = req.body;
  const attendance = await Attendance.find({
    $and: [
      {
        month: month,
        companyId: companyId,
        userId: userId,
        branchId: branchId,
      },
    ],
  }).populate("punchingInfo.punchInInfo");
  return res.status(200).json({
    message: "ok",
    attendance: attendance,
  });
};

const handleGetOneSpecificDateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const attendance = await Attendance.findById(attendanceId)
    .populate("punchingInfo.punchInInfo")
    .populate("punchingInfo.punchOutInfo");
  if (!attendance) {
    return res.status(404).json({
      message: "Attendance not found!",
    });
  }
  return res.status(200).json({
    message: "ok",
    attendance: attendance,
  });
};

// Fetch attendance statistics for the dashboard
const handleGetAttendanceCount = async (req, res) => {
  // const { companyId } = req.params;
  const user = req.user;
  const attendance = await Attendance.find({
    $and: [
      {
        date: formatDateForComparison(new Date()),
        companyId: user.roleInfo.company,
      },
    ],
    // branchId: user.roleInfo.branch,
  })
    .populate("punchingInfo.punchInInfo")
    .populate("punchingInfo.punchOutInfo");

  return res.status(200).json({
    message: "ok",
    attendance: attendance,
    puchInCount: attendance.length,
  });
};

const handleUpdatePunchInInformation = async (req, res) => {
  const { punchInId, date, time } = req.body;
  const user = req.user;
  if (user.roleInfo.role === "employee") {
    return res.status(401).json({ message: "unauthorized for action." });
  }
  const dateInfo = formatDateAndTime(date, time);
  const punchInInfo = await PunchIn.findByIdAndUpdate(
    punchInId,
    { visibleTime: dateInfo },
    { new: true }
  );
  if (!punchInInfo) {
    return res.status(400).json({ message: "invalid punchIn id." });
  }

  return res.status(200).json({
    message: "ok",
    punchInInfo: punchInInfo,
  });
};

const handleUpdatePunchOutInformation = async (req, res) => {
  const { punchOutId, date, time } = req.body;
  const user = req.user;
  if (user.roleInfo.role === "employee") {
    return res.status(401).json({ message: "unauthorized for action." });
  }
  const dateInfo = formatDateAndTime(date, time);
  const punchOutInfo = await PunchOut.findByIdAndUpdate(
    punchOutId,
    { visibleTime: dateInfo },
    { new: true }
  );
  if (!punchOutInfo) {
    return res.status(400).json({ message: "invalid punchIn id." });
  }

  return res.status(200).json({
    message: "ok",
    punchOutInfo: punchOutInfo,
  });
};

export {
  handlemarkPunchIn,
  handlemarkPunchOut,
  handleGetOneSpecificUserAttendance,
  handleGetOneSpecificMonthAttendance,
  handleGetOneSpecificDateAttendance,
  handleGetAttendanceCount,
  handleUpdateAttandance,
  handleUpdatePunchOutInformation,
  handleUpdatePunchInInformation,
};
