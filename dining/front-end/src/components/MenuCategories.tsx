import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import CategoryDialog from "./partials/category-dialog";

interface Category {
  _id: string;
  name: string;
  type: string;
  description: string;
  image: string;
}

const MenuCategories: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // track which 3-dots menu is open
  const navigate = useNavigate();

  const fetchCategories = () => {
    axios
      .get(`/api/menu/getAll`)
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`/api/menu/delete/category/${id}`)
        .then((res) => {
          console.log("Deleted successfully", res.data);
          fetchCategories(); // Refresh list
        })
        .catch((err) => {
          console.error("Failed to delete category", err);
        });
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleCloseDialog = () => {
    setShowForm(false);
    setEditCategory(null);
  };
  const handleOpenDialog = () => {
    setShowForm(true);
  };
  const handleEditClick = (cat: Category) => {
    setEditCategory({ ...cat });
    setOpenMenuId(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Menu &gt;&gt; Categories</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Add Category Card */}
        <div
          onClick={handleOpenDialog}
          className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 h-64 rounded-lg cursor-pointer"
        >
          <span className="text-4xl font-bold text-gray-400">+</span>
          <p className="mt-2 font-semibold">Add Category</p>
        </div>

        {/* Render Categories */}
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="relative border rounded-lg shadow-sm h-64 flex flex-col items-center justify-between p-4"
          >
            {/* 3 dots button */}
            <div className="absolute top-2 right-2">
              <button onClick={() => toggleMenu(cat._id)}>
                <span className="absolute top-2 right-2 cursor-pointer text-gray-800 group-hover:text-black">
                  {" "}
                  &#x22EE;
                </span>
              </button>

              {/* Dropdown menu */}
              {openMenuId === cat._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Card content */}
            <div onClick={() => navigate(`/${id}/categoryItems/${cat._id}`)}>
              <img
                src={cat.image}
                alt={cat.name}
                className="h-40 object-contain"
              />
              <div className="text-center cursor-pointer">
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm text-gray-600">{cat.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Form */}
      {/* <ItemDialog isOpen={showForm}  /> */}
      <CategoryDialog
        isOpen={showForm}
        closeDialog={handleCloseDialog}
        edit={editCategory}
      />
      {/* {showForm && (
      )} */}
    </div>
  );
};

export default MenuCategories;
