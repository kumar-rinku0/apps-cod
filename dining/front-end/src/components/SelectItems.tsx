import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

interface Item {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const SelectItems: React.FC = () => {
  const { id, eventId, mealId, categoryId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/menu/getAll/${categoryId}`)
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load items"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleItemClick = (item: Item) => {
    axios
      .post("/api/meals/select", {
        mealId: mealId,
        itemId: item._id,
      })
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateToCategory = () => {
    navigate(`/${id}/${eventId}/${mealId}/select-categories`);
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

      <h2 className="text-xl font-semibold mb-6">Select Items</h2>

      {loading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => handleItemClick(item)}
              className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm font-medium mt-2">{item.price} per plate</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          onClick={() => navigate(`/${id}/${eventId}/meal-preview`)}
        >
          Preview and Continue
        </button>
      </div>
    </div>
  );
};

export default SelectItems;
