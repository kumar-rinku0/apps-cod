import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
