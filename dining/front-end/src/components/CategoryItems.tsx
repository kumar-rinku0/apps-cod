import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ItemDialog from "./partials/item-dialog";

interface MenuItem {
  _id: string; // changed from id: number to _id: string
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

interface MenuCategory {
  _id: string;
  name: string;
  type: string;
}

const CategoryItems: React.FC = () => {
  const [item, setItem] = useState<{
    menuItem: MenuItem[];
    menuCategory: MenuCategory[];
  }>({ menuItem: [], menuCategory: [] });
  const { id } = useParams();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);

  const fetchItems = () => {
    axios
      .get(`/api/menu/getAll/${categoryId}`)
      .then((res) => {
        setItem((prev) => ({ ...prev, menuItem: res.data }));
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  };
  const fetchCategories = () => {
    axios
      .get(`/api/menu/getAll`)
      .then((res) => {
        setItem((prev) => ({ ...prev, menuCategory: res.data }));
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  };
  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/menu/delete/item/${_id}`);
        setItem((prev) => ({
          ...prev,
          menuItem: prev.menuItem.filter((it) => it._id !== _id),
        }));
      } catch (err) {
        console.error("Failed to delete item", err);
      }
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setShowOptionsId(null);
    setShowForm(true);
  };

  const handleCloseDialog = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleOpenDialog = () => {
    setShowForm(true);
  };

  const navigateToCategory = () => {
    navigate(`/${id}/menu`);
  };

  return (
    <div className="p-6">
      <button
        onClick={navigateToCategory}
        className="flex items-center text-sm text-gray-700 mb-4 hover:underline"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="mr-2 text-2xl text-blue-600"
        />
      </button>
      <h2 className="text-xl font-bold mb-6">
        Menu &gt;&gt; Categories &gt;&gt; Snacks
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Add Item Button */}
        <div
          onClick={handleOpenDialog}
          className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 h-64 rounded-lg cursor-pointer hover:border-gray-500 transition"
        >
          <span className="text-4xl font-bold text-gray-400">+</span>
          <p className="mt-2 font-semibold">Add Item</p>
        </div>

        {/* Menu Items */}
        {item.menuItem.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg shadow-md h-64 flex flex-col items-center justify-between p-4 relative group"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-36 object-contain"
            />
            <div className="text-center">
              <p className="font-bold text-lg">{item.name}</p>
              <p className="text-sm text-gray-600">₹{item.price} per plate</p>
            </div>

            {/* 3 Dots Button */}
            <div
              onClick={() =>
                setShowOptionsId(showOptionsId === item._id ? null : item._id)
              }
              className="absolute top-2 right-2 cursor-pointer text-gray-800 group-hover:text-black"
            >
              &#x22EE;
            </div>

            {/* Edit/Delete options */}
            {showOptionsId === item._id && (
              <div className="absolute top-8 right-2 bg-white border shadow-md rounded z-10">
                <button
                  onClick={() => handleEditClick(item)}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(item._id);
                    setShowOptionsId(null);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form for Add/Edit */}

      <ItemDialog
        isOpen={showForm}
        closeDialog={handleCloseDialog}
        edit={editingItem}
        categoryId={categoryId || ""}
      />
    </div>
  );
};

export default CategoryItems;
