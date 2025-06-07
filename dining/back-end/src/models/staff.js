import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "SUB-ADMIN", "OPERATOR", "CUSTOMER"], required: true },
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;