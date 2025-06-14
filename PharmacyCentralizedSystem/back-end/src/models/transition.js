import { Schema, model } from "mongoose";

const transitionSchema = new Schema(
  {
    pharmacyInfo: {
      type: Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },
    pharmacyName: {
      type: String,
      required: true,
    },
    customerInfo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    medicationInfo: {
      type: [
        {
          medication: {
            type: Schema.Types.ObjectId,
            ref: "Medication",
          },
          quantity: Number,
          totalPrice: Number,
        },
      ],
      required: true,
    },
    totalPrice: Number,
  },
  { timestamps: true }
);

const Transition = model("Transition", transitionSchema);

export default Transition;
