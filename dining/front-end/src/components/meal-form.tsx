import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface MealFormProps {
  id: string;
  eventId: string;
}

const MealForm: React.FC<MealFormProps> = ({ id, eventId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mealType: "",
    startTime: "",
    endTime: "",
    address: "",
    numberOfGuests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(`/api/meals/create`, { ...formData, eventId: eventId })
      .then((res) => {
        alert("Meal created successfully!");
        navigate(`/${id}/${eventId}/${res.data.meal._id}/select-categories`);
      })
      .catch((err) => {
        console.error(err);
        alert("Error creating meal. Please try again.");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-5 border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
        🍽️ Add Meal Details
      </h2>

      <select
        name="mealType"
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      >
        <option value="">Select Meal Type</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
      </select>

      <input
        type="datetime-local"
        name="startTime"
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      />

      <input
        type="datetime-local"
        name="endTime"
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      />

      <input
        type="text"
        name="address"
        placeholder="Meal Location Address"
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      />

      <input
        type="number"
        name="numberOfGuests"
        placeholder="Number of Guests"
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      />

      <button
        type="submit"
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-md hover:bg-orange-600 transition"
      >
        Submit Meal
      </button>
    </form>
  );
};

export default MealForm;
