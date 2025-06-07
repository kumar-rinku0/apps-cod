import Customer from "../models/customer.js";
import Medication from "../models/medication.js";
import Pharmacy from "../models/pharmacy.js";
import Transition from "../models/transition.js";

export const handleCreateCustomerTransitionByCustomerId = async (req, res) => {
  const { licencekey, customerId } = req.query;
  console.log(licencekey);
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  let { medication } = req.body;
  if (!Array.isArray(medication)) {
    return res.status(403).json({ message: "expected array!" });
  }
  const newTransition = new Transition({
    customerInfo: customerId,
    pharmacyInfo: pharmacy._id,
    pharmacyName: pharmacy.name,
  });

  for (const item of medication) {
    const med = new Medication(item);
    await med.save();
    newTransition.medicationInfo.push({
      medication: med._id,
      customerInfo: customerId,
      quantity: item.quantity || 1,
    });
  }

  await newTransition.save();
  return res
    .status(201)
    .json({ message: "transition created.", transition: newTransition });
};

export const handleCreateCustomerTransitionByEmailId = async (req, res) => {
  const { licencekey } = req.headers;
  let { medications, customerEmail } = req.body;
  console.log(licencekey);
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  const customer = await Customer.findOne({ email: customerEmail }).exec();
  if (!customer) {
    return res.status(400).json({ message: "customer doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  if (!Array.isArray(medications)) {
    return res.status(403).json({ message: "expected array!" });
  }
  const newTransition = new Transition({
    customerInfo: customer._id,
    pharmacyInfo: pharmacy._id,
    pharmacyName: pharmacy.name,
  });

  for (const item of medications) {
    const med = new Medication(item);
    await med.save();
    newTransition.medicationInfo.push({
      medication: med._id,
      customerInfo: customer._id,
      quantity: item.quantity || 1,
    });
  }

  await newTransition.save();
  return res.status(201).json({
    message: "transition created.",
    transition: newTransition,
    customer: customer,
  });
};

export const handleCreateCustomerTransitionByNewCustomer = async (req, res) => {
  const { licencekey } = req.headers;
  console.log(licencekey);
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  let { medications, customerInfo } = req.body;
  let customer = await Customer.findOne({
    $or: [
      { email: customerInfo.email },
      { postalCode: customerInfo.postalCode },
    ],
  });
  if (!customer) {
    const newCustomer = new Customer(customerInfo);
    customer = newCustomer;
    await newCustomer.save();
  }
  if (!Array.isArray(medications)) {
    return res.status(403).json({ message: "expected array!" });
  }
  const newTransition = new Transition({
    customerInfo: customer._id,
    pharmacyInfo: pharmacy._id,
    pharmacyName: pharmacy.name,
  });

  for (const item of medications) {
    const med = new Medication(item);
    await med.save();
    newTransition.medicationInfo.push({
      medication: med._id,
      customerInfo: customer._id,
      quantity: item.quantity || 1,
    });
  }

  await newTransition.save();
  return res.status(201).json({
    message: "transition created.",
    transition: newTransition,
    customer: customer,
  });
};

export const handleGetCustomerTransitionByEmailId = async (req, res) => {
  const { licencekey } = req.headers;
  const { customerEmail } = req.query;
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  const customer = await Customer.findOne({ email: customerEmail }).exec();
  if (!customer) {
    return res.status(400).json({ message: "customer doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  const transitions = await Transition.find({ customerInfo: customer._id })
    .sort({
      createdAt: "descending",
    })
    .populate("pharmacyInfo", { name: 1, email: 1, address: 1 })
    .populate("medicationInfo.medication");

  return res
    .status(200)
    .json({ message: "okay!", transitions: transitions, sort: "-1" });
};

export const handleGetCustomerTransitionByCustomerId = async (req, res) => {
  const { licencekey, customerId } = req.query;
  console.log(licencekey);
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(400).json({ message: "customer doesn't exist!" });
  }
  const transitions = await Transition.find({ customerInfo: customerId })
    .sort({
      createdAt: "descending",
    })
    .populate("medicationInfo.medication");

  return res
    .status(200)
    .json({ message: "okay!", transitions: transitions, sort: "-1" });
};

export const handleGetSearchResultByQuery = async (req, res) => {
  const { email, medic, postal } = req.query;
  const { licencekey } = req.headers;
  const isMedic = medic && medic !== "";
  const pharmacy = await Pharmacy.findOne({ licenceKey: licencekey }).exec();
  if (!pharmacy) {
    return res.status(400).json({ message: "licence doesn't exist!" });
  }
  if (!postal && !email) {
    const recentTransition = await Transition.find({})
      .sort({
        createdAt: "descending",
      })
      .populate("pharmacyInfo", { name: 1, email: 1, address: 1 })
      .populate("customerInfo", { fullName: 1, dob: 1, email: 1, postalCode: 1 })
      .populate("medicationInfo.medication");
    const filterTransition = recentTransition.filter((item) => {
      return item.medicationInfo.some((subitem) => {
        return subitem.medication.name
          .toLowerCase()
          .includes(medic.toLowerCase());
      });
    });
    filterTransition.filterBy = medic;
    return res.status(200).json({
      message: "okay!",
      transitions: isMedic ? filterTransition : recentTransition,
      isMedic: isMedic ? medic : null,
      sort: "-1",
    });
  }
  const customer = await Customer.findOne({
    $or: [{ email: email }, { postalCode: postal }],
  }).exec();
  if (!customer) {
    return res.status(400).json({ message: "customer doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  const transitions = await Transition.find({ customerInfo: customer._id })
    .sort({
      createdAt: "descending",
    })
    .populate("pharmacyInfo", { name: 1, email: 1, address: 1 })
    .populate("customerInfo", { fullName: 1, dob: 1, email: 1, postalCode: 1 })
    .populate("medicationInfo.medication");

  const filterTransition = transitions.filter((item) => {
    return item.medicationInfo.some((subitem) => {
      return subitem.medication.name
        .toLowerCase()
        .includes(medic.toLowerCase());
    });
  });
  filterTransition.filterBy = medic;
  return res.status(200).json({
    message: "okay!",
    transitions: isMedic ? filterTransition : transitions,
    isMedic: isMedic ? medic : null,
    sort: "-1",
  });
};

export const handleGetCustomerTransitionByQueryWithOutLicence = async (
  req,
  res
) => {
  const { email, medic, postal } = req.query;
  const isMedic = medic && medic !== "";
  if (!postal && !email) {
    const recentTransition = await Transition.find({})
      .sort({
        createdAt: "descending",
      })
      .populate("pharmacyInfo", { name: 1, email: 1, address: 1 })
      .populate("customerInfo", { fullName: 1, dob: 1, email: 1, postalCode: 1 })
      .populate("medicationInfo.medication");
    const filterTransition = recentTransition.filter((item) => {
      return item.medicationInfo.some((subitem) => {
        return subitem.medication.name
          .toLowerCase()
          .includes(medic.toLowerCase());
      });
    });
    filterTransition.filterBy = medic;
    return res.status(200).json({
      message: "okay!",
      transitions: isMedic ? filterTransition : recentTransition,
      isMedic: isMedic ? medic : null,
      sort: "-1",
    });
  }
  const customer = await Customer.findOne({
    $or: [{ email: email }, { postalCode: postal }],
  }).exec();
  if (!customer) {
    return res.status(400).json({ message: "customer doesn't exist!" });
  }
  if (pharmacy.licenceExpiry <= Date.now()) {
    return res
      .status(403)
      .json({ message: "licence expired, renew it again!" });
  }
  const transitions = await Transition.find({ customerInfo: customer._id })
    .sort({
      createdAt: "descending",
    })
    .populate("pharmacyInfo", { name: 1, email: 1, address: 1 })
    .populate("customerInfo", { fullName: 1, dob: 1, email: 1, postalCode: 1 })
    .populate("medicationInfo.medication");

  const filterTransition = transitions.filter((item) => {
    return item.medicationInfo.some((subitem) => {
      return subitem.medication.name
        .toLowerCase()
        .includes(medic.toLowerCase());
    });
  });
  filterTransition.filterBy = medic;
  return res.status(200).json({
    message: "okay!",
    transitions: isMedic ? filterTransition : transitions,
    isMedic: isMedic ? medic : null,
    sort: "-1",
  });
};

// transitions
