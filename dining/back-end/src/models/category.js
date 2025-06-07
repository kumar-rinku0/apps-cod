import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String,
    type: String,
    description: String,
    image: String,
});

const Category = mongoose.model("Category", categorySchema);
export default Category;




//okkk




