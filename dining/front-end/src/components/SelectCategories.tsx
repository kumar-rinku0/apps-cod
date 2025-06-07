import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

// Define the category type
interface Category {
  _id: string;
  name: string;
  image: string;
}

const SelectCategories: React.FC = () => {
  const navigate = useNavigate();
  const { id, eventId, mealId } = useParams<{
    id: string;
    eventId: string;
    mealId: string;
  }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCategories = () => {
    axios
      .get(`/api/menu/getAll`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        setError("Failed to fetch categories");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = async (category: Category) => {
    navigate(`/${id}/${eventId}/${mealId}/select-itms/${category._id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Create Meals &gt;&gt; Menu &gt;&gt; Categories
      </h2>

      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-40 h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{cat.name}</h3>
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

export default SelectCategories;

//okkkk
