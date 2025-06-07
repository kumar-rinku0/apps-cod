import { Schema, model } from "mongoose";

const quotationSchema = new Schema({
    quotationId: {
        type: String,
        unique: true,
        default: () => `QTN${Date.now()}`,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED"],
        default: "PENDING",
    },
}, { timestamps: true });


const Quotation = model("Quotation", quotationSchema);
export default Quotation;



