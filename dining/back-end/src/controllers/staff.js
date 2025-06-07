import User from "../models/staff.js";

// Add a new user
const handleAddUser = async (req, res) => {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
}

// Get all users
const handleGetAllUsers = async (_req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}

export { handleAddUser, handleGetAllUsers }