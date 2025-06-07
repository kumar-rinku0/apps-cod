import User from "../models/user.js";
import { setUser } from "../utils/jwt.js";
import { isRightUser } from "../utils/functions.js";
import bcrypt from "bcryptjs";
import {
  createMailSystem,
  createMailSystemForUserStatus,
  createMailSystemToProvideRegistationInfoToAdmin,
  createMailSystemToProvideRegistationInfoToPharmacist,
} from "../utils/mail.js";
import Pharmacy from "../models/pharmacy.js";

const handleUserSignUp = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  const userbyemail = await User.findOne({ email });
  if (userbyemail) {
    return res
      .status(500)
      .send({ message: "user already exist.", user: userbyemail });
  }
  const user = new User({
    fullName,
    email,
    phone,
    password,
    role: "admin",
  });
  await user.save();
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).send({ message: "user created.", user: user });
};

const handleUserSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await isRightUser(email, password);
  if (user?.message) {
    return res.status(401).json({ message: user.message, status: 401 });
  }
  const token = setUser(user);
  res.cookie("JWT_TOKEN", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).json({ user: user, message: "login successful" });
};

const handleUserLogout = async (req, res) => {
  res.cookie("JWT_TOKEN", "");
  return res.status(200).json({ message: "logout successful" });
};

const handleGetOneUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "invailid user id." });
  }
  return res.status(200).json({ user: user, message: "ok!" });
};

// verify user
const handleUserVerify = async (req, res) => {
  const { TOKEN } = req.query;
  console.log(TOKEN);
  const user = await User.findOne({ verifyToken: TOKEN });
  if (user && user.verifyTokenExpire > Date.now()) {
    const info = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verifyToken: null,
      },
      { new: true }
    );
    if (info && info.role === "pharmacist") {
      const pharmacy = await Pharmacy.findOne({ createdBy: info._id });
      await createMailSystemToProvideRegistationInfoToPharmacist({
        _id: info._id,
        address: info.email,
        pharmacy: pharmacy,
      });
      // await createMailSystemToProvideRegistationInfoToAdmin({_id: info._id, address: info.email, pharmacy: pharmacy});
    }
    return res
      .status(200)
      .json({ message: "user verified.", user: info, status: 200 });
  }
  return res.status(400).json({ message: "Invalid token.", status: 400 });
};

const handleUserSendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found." });
  }
  await createMailSystem({
    address: user.email,
    type: "verify",
    _id: user._id,
  });
  return res.status(200).json({ message: "verify email sent." });
};

// reset password
const handleUserSendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found." });
  }
  await createMailSystem({ address: email, type: "reset", _id: user._id });
  return res.status(200).json({ message: "reset email sent." });
};

const handleUserResetPassword = async (req, res) => {
  const { TOKEN } = req.query;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: TOKEN });
  if (!user) {
    return res.status(400).json({ message: "Invalid token." });
  }
  if (user.resetTokenExpire < Date.now()) {
    return res.status(400).json({ message: "Token expired." });
  }
  const salt = await bcrypt.genSalt(10);
  const hexcode = await bcrypt.hash(password.trim(), salt);
  const info = await User.findByIdAndUpdate(
    user._id,
    {
      password: hexcode,
      resetToken: null,
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Password reset successful.", user: info });
};

const handleDeleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(400).json("invalid id.");
  }
  return res
    .status(200)
    .json({ message: "user account deleted.", status: 200, deletedUser: user });
};

const handleGetUsers = async (req, res) => {
  const filter = req.query.filter?.toString() || "";
  const search = req.query.query?.toString() || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const query = {
    $and: [
      { role: { $in: [filter] } },
      {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    users,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

const handleToggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = user.status === "active" ? "inactive" : "active";
  await user.save();
  const pharmacy = await Pharmacy.findOne({ createdBy: user._id });
  if (pharmacy) {
    await createMailSystemForUserStatus({
      address: user.email,
      pharmacyName: pharmacy.name,
      status: user.status,
    });
  }
  return res
    .status(200)
    .json({ message: "User status updated", status: user.status });
};

const handleUpdateAdminAstrisk = async (req, res) => {
  const { userid } = req.params;
  await User.findOneAndUpdate(
    { $and: [{ role: "admin", isPrimary: true }] },
    { isPrimary: false }
  );
  const user = await User.findById(userid);
  user.isPrimary = true;
  await user.save();
  return res
    .status(200)
    .json({ message: "user updated to supper admin!", user: user });
};

export {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
  handleGetOneUser,
  handleUserVerify,
  handleUserResetPassword,
  handleUserSendVerifyEmail,
  handleUserSendResetEmail,
  handleDeleteUser,
  handleGetUsers,
  handleToggleUserStatus,
  handleUpdateAdminAstrisk,
};
