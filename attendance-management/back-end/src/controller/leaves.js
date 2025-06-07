import Leaves from "../model/leaves.js";

const handleRequestLeave = async (req, res) => {
  const { employeeId, leaveType, fromDate, toDate, halfDay, reason } = req.body;

  if (!employeeId || !leaveType || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newLeave = new Leaves({
    employeeId,
    leaveType,
    fromDate,
    toDate,
    halfDay,
    reason,
  });

  await newLeave.save();
  res.status(201).json({ message: "Leave request submitted", leave: newLeave });
};

const handleGetAllRequestLeave = async (req, res) => {
  const leaves = await Leaves.find({});
  if (!leaves) {
    return res.status(200).json({ message: "Leave Request not exist." });
  }
  return res.status(200).json({ leaves: leaves });
};

const handleGetAllPendingRequestLeave = async (req, res) => {
  const leaves = await Leaves.find({ status: "Pending" });
  if (!leaves) {
    return res.status(200).json({ message: "Leave Request not exist." });
  }
  return res.status(200).json({ leaves: leaves });
};

const handleGetAllNotPendingRequestLeave = async (req, res) => {
  const leaves = await Leaves.find({
    $nor: [{ status: "Pending" }],
  });
  if (!leaves) {
    return res.status(200).json({ message: "Leave Request not exist." });
  }
  return res.status(200).json({ leaves: leaves });
};

// // Update leave status (e.g., Approve)
const updateLeaveStatus = async (req, res) => {
  const leaves = await Leaves.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!leaves) return res.status(404).json({ error: "Leave not found" });
  res.json(leaves);
};

// Delete leave (Reject)
const deleteLeave = async (req, res) => {
  const result = await Leaves.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "Leave not found" });
  res.json({ message: "Leave deleted successfully" });
};

const handleGetOneUserPendingRequestLeave = async (req, res) => {
  const { userId } = req.query;
  const leaves = await Leaves.find({ $and: [{ employeeId: userId, status: "Pending" }], });
  if (leaves.length > 0) {
    return res.status(200).json({ message: "okay", leaves: leaves })
  }
  return res.status(200).json({ message: "not any panding request.", leaves: leaves })
}

const handleGetOneUserNotPendingRequestLeave = async (req, res) => {
  const { userId } = req.query;
  const leaves = await Leaves.find({ employeeId: userId, $nor: [{ status: "Pending" }], });
  if (leaves.length > 0) {
    return res.status(200).json({ message: "okay", leaves: leaves })
  }
  return res.status(200).json({ message: "not any panding request.", leaves: leaves })
}

export {
  handleRequestLeave,
  handleGetAllRequestLeave,
  handleGetAllPendingRequestLeave,
  handleGetAllNotPendingRequestLeave,
  handleGetOneUserPendingRequestLeave,
  handleGetOneUserNotPendingRequestLeave,
  deleteLeave,
  updateLeaveStatus,
};
