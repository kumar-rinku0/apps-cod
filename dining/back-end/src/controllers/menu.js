import Category from "../models/category.js";
import Item from "../models/item.js";
import fs from "fs";

// -------- CATEGORY --------

const handleCreateCategory = async (req, res) => {
  const { name, type, description } = req.body;
  const newCategory = new Category({
    name,
    type,
    description,
    image: req.url,
  });

  await newCategory.save();
  return res.status(201).json(newCategory);
};

const handleGetAllCategories = async (req, res) => {
  const categories = await Category.find();
  return res.json(categories);
};

// -------- ITEM --------

const handleCreateItem = async (req, res) => {
  const { name, price, description, category } = req.body;
  const newItem = new Item({
    name,
    price,
    description,
    image: req.url,
    category: category, // Assuming you are sending categoryId in the request body
  });

  await newItem.save();
  return res.status(201).json(newItem);
};

const handleGetAllItems = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required" });
  }
  const items = await Item.find({ category: categoryId });
  return res.json(items);
};

// Update Item
const handleUpdateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  let updatedData = { name, price, description, image: req.url }; // ← removed ': any'

  const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedItem) {
    return res.status(404).json({ error: "Item not found" });
  }

  return res.json(updatedItem);
};

// Delete Item
const handleDeleteMenuItem = async (req, res) => {
  const { id } = req.params;
  const deletedItem = await Item.findByIdAndDelete(id);

  if (!deletedItem) {
    return res.status(404).json({ error: "Item not found" });
  }

  return res.json({ message: "Item deleted successfully" });
};

// Update Category
const handleUpdateMenuCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type, description } = req.body;
  let updatedData = { name, type, description, image: req.url }; // ← removed ': any'

  const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  return res.json(updatedCategory);
};

// Delete Category
const handleDeleteMenuCategory = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  return res.json({ message: "Item deleted successfully" });
};

// okay

export {
  handleGetAllCategories,
  handleCreateCategory,
  handleGetAllItems,
  handleCreateItem,
  handleUpdateMenuItem,
  handleDeleteMenuItem,
  handleUpdateMenuCategory,
  handleDeleteMenuCategory,
};
