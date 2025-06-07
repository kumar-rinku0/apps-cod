import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "caterer", "operator", "user"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifyToken: String,
        verifyTokenExpire: Date,
        resetToken: String,
        resetTokenExpire: Date,
        lastActive: {
            type: Date,
            default: () => Date.now(),
        },
        lastLogin: {
            type: Date,
            default: () => Date.now(),
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.companyWithRole && Array.isArray(this.companyWithRole)) {
        const values = new Set();
        for (const roleObj of this.companyWithRole) {
            // If company is missing, handle it based on your requirement.
            if (!roleObj.company) {
                return next(
                    new Error("company is required to assign a role to a user.")
                );
            }
            // If company is already in the Set, throw an error for uniqueness
            if (values.has(roleObj.company.toString())) {
                return next(
                    new Error("company must be unique along with employee role.")
                );
            }
            // Add the company to the Set to track uniqueness
            values.add(roleObj.company.toString());
        }
    }
    // Proceed to the next middleware if no error was thrown
    return next();
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hexcode = await bcrypt.hash(this.password.trim(), salt);
        this.password = hexcode;
    }
    next();
});

const User = model("User", userSchema);

export default User;