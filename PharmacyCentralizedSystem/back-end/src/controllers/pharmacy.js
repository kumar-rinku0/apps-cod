import Pharmacy from "../models/pharmacy.js";
import User from "../models/user.js";
import { createMailSystemForVerifyPharmacyRegistration } from "../utils/mail.js";

export const handleGetPharmacyByUserId = async (req, res) => {
  const { userId } = req.params;
  const pharmacies = await Pharmacy.find({ createdBy: userId }).populate(
    "createdBy"
  );
  return res
    .status(200)
    .json({ message: "its all pharmacy", pharmacies: pharmacies });
};

export const handleGetPharmacyByPharmacyId = async (req, res) => {
  const { pharmacyId } = req.params;
  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    return res.status(400).json({ message: "invalid pharmacy id!" });
  }
  return res
    .status(200)
    .json({ message: "desired pharmacy!", pharmacy: pharmacy });
};

export const handleUpdatePharmacy = async (req, res) => {
  const { pharmacyId } = req.params;
  const obj = req.body;
  const url = req.url;
  console.log(url);
  if (!url) {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      pharmacyId,
      { ...obj },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "pharmacy updated.", pharmacy: pharmacy });
  }
  const pharmacy = await Pharmacy.findByIdAndUpdate(
    pharmacyId,
    { ...obj, logo: url },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "pharmacy updated.", pharmacy: pharmacy });
};

export const handleDeletePharmacy = async (req, res) => {
  const { pharmacyId } = req.params;
  const pharmacy = await Pharmacy.findByIdAndDelete(pharmacyId);

  return res
    .status(200)
    .json({ message: "pharmacy deleted.", pharmacy: pharmacy });
};

export const handleCreatePharmacy = async (req, res) => {
  const obj = req.body;
  const url = req.url;
  const {
    name,
    email,
    phone,
    password,
    owner,
    licenceExpiry,
    registrationNumber,
  } = obj;
  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !owner ||
    !licenceExpiry ||
    !registrationNumber
  ) {
    res.status(400).json({
      message: "didn't filled required pharmacy fields!",
      status: 400,
    });
  }
  console.log(password, licenceExpiry);
  const user = await User.findOne({ email }).exec();
  if (!user) {
    const newUser = new User({
      fullName: owner,
      email,
      phone,
      password: password.trim(),
      role: "pharmacist",
    });
    await newUser.save();
    if (url) {
      obj.logo = url;
    }
    const pharmacy = new Pharmacy({
      ...obj,
      createdBy: newUser._id,
      registrationNumber: registrationNumber,
      licenceExpiry: Date.now() + licenceExpiry * 24 * 60 * 60 * 1000,
    });
    await pharmacy.save();
    await createMailSystemForVerifyPharmacyRegistration({
      _id: newUser._id,
      address: newUser.email,
      pharmacyName: pharmacy.name,
    });

    return res.status(201).json({
      message:
        "A verification email has been sent to your email address. please verify it to complete your registration and log in.",
      pharmacy: pharmacy,
    });
  }
  return res.status(400).json({
    message: "email address is already registered with pharmacy!",
    status: 400,
  });
};

export const handleGetPharmacies = async (req, res) => {
  const pharmacies = await Pharmacy.find({}).populate("createdBy");
  return res
    .status(200)
    .json({ pharmacies: pharmacies, message: "okay.", status: 200 });
};

// export const handleCreatePharmacy = async (req, res) => {
//   const obj = req.body;
//   const url = req.url;
//   const { licenceExpiry } = obj;
//   console.log(licenceExpiry);
//   const user = req.user;
//   const pharmacy = new Pharmacy({
//     ...obj,
//     logo: url,
//     createdBy: user._id,
//     licenceExpiry: Date.now() + licenceExpiry * 24 * 60 * 60 * 1000,
//   });
//   await pharmacy.save();

//   return res
//     .status(201)
//     .json({ message: "pharmacy created.", pharmacy: pharmacy });
// };
