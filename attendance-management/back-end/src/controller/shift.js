import Shift from "../model/shift.js";

export const getAllShifts = async (req, res) => {
  const shifts = await Shift.find();
  if (shifts.length === 0) {
    return res.status(404).json({ message: "No shifts found!" });
  }
  return res.status(200).json(shifts);
};

export const getShiftByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  const shift = await Shift.findOne({ employeeId });
  if (!shift) {
    return res
      .status(404)
      .json({ message: `No shift found for employeeId: ${employeeId}` });
  }
  return res.status(200).json({ shift: shift });
};

export const handleCreateShifts = async (req, res) => {
  const { shiftType, shiftStartTime, shiftEndTime, workDays, userId } =
    req.body;
  const previous = await Shift.findOne({ employeeId: userId });
  if (previous) {
    return res
      .status(201)
      .send({ message: "already have one.", shift: previous });
  }
  const shift = new Shift({
    shiftType,
    shiftStartTime,
    shiftEndTime,
    employeeId: userId,
    workDays,
  });
  await shift.save();
  return res.status(201).send({ message: "created.", shift: shift });
};
