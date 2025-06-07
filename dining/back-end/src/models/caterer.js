// models/Caterer.ts
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true    
    },
    companyName: String,
    proprietorName: String,
    website: String,
    uniqueURL: String,
    about: String,
    estDate: Date,
    logo: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    billingAddress: String,
    bankName: String,
    branchName: String,
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    gst: String,
    pan: String,
    isActive: String,
}, { timestamps: true });


const Profile = mongoose.model("Profile", profileSchema);

export default Profile;