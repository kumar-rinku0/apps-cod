import Personal from "../model/personal.js";

const handleCreatePersonal = async (req, res) => {
    const { userId, dob, gender, phone, maritalStatus, bloodGroup, address, emergencyContact } = req.body;
    // Check if the userId already exists in the database
    const existingPersonal = await Personal.findOne({ userId: userId });
    if (existingPersonal) {
        existingPersonal.dob = dob;
        existingPersonal.gender = gender;
        existingPersonal.phone = phone;
        existingPersonal.maritalStatus = maritalStatus;
        existingPersonal.bloodGroup = bloodGroup;
        existingPersonal.emergencyContact = emergencyContact;
        existingPersonal.address = address;
        await existingPersonal.save();
        return res.status(200).json({ message: "Personal details updated successfully." });
    }

    const newPersonal = new Personal({
        userId,
        dob,
        gender,
        phone,
        maritalStatus,
        bloodGroup,
        emergencyContact,
        address,
    });

    await newPersonal.save();
    return res.status(201).json({ message: "Personal details submitted successfully." });
};

const handleGetPersonal = async (req, res) => {
    const { userId } = req.params;
    const personals = await Personal.findOne({ userId });
    if (!personals) {
        return res.status(200).json({ message: "Personal details not exist." });
    }
    // If the personal details are found, return them in the response
    return res.status(200).json({ personals: personals });
};

export { handleCreatePersonal, handleGetPersonal };
