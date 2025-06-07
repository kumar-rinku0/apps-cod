// controllers/caterer.js
import Profile from "../models/caterer.js";
import User from "../models/user.js";
import { generateRandomString } from "../utils/fuctions.js";
import { createMailSystem } from "../utils/mail.js";

// Create a new Caterer
const handleRegisterCaterer = async (req, res) => {
  const { email, proprietorName, ...rest } = req.body;

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered." });
  }
  const password = generateRandomString(4);
  const user = new User({
    firstName: proprietorName.split(" ")[0],
    lastName: proprietorName.split(" ")[1] || "",
    email,
    password: password,
    role: "caterer",
  })

  await user.save();

  const profile = new Profile({
    email,
    logo: req.url,
    userId: user._id,
    ...rest,
  });
  await profile.save();
  await createMailSystem({ address: email, type: "password", _id: password });
  res.status(201).json({ message: "Caterer registered successfully!", profile: profile });
};

// Fetch Caterer by ID
const handleGetOneCatererById = async (req, res) => {
  const { id } = req.params;
  const caterer = await Profile.findById(id);
  if (!caterer) {
    return res.status(404).json({ message: "Caterer not found" });
  }
  return res.status(200).json({ caterer });
};
// Fetch Caterer by User ID
const handleGetOneCatererByUserId = async (req, res) => {
  const { userId } = req.params;
  const caterer = await Profile.findOne({userId: userId}).populate("userId");
  if (!caterer) {
    return res.status(404).json({ message: "Caterer not found" });
  }
  return res.status(200).json({ caterer });
};

// Update Caterer
const handleUpdateCaterer = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (req.url) {
    updateData.logo = req.url;
  }

  const updatedCaterer = await Profile.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedCaterer) {
    return res.status(404).json({ message: "Caterer not found" });
  }

  res.status(200).json({
    message: "Caterer updated successfully",
    caterer: updatedCaterer
  });
};

// Delete Caterer
const handleDeleteCaterer = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Caterer ID is required" });
  }

  const deletedCaterer = await Profile.findByIdAndDelete(id);
  if (!deletedCaterer) {
    return res.status(404).json({ message: "Caterer not found" });
  }

  res.status(200).json({
    message: "Caterer deleted successfully",
    caterer: deletedCaterer
  });
};

export {
  handleRegisterCaterer,
  handleGetOneCatererById,
  handleGetOneCatererByUserId,
  handleUpdateCaterer,
  handleDeleteCaterer
};