import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import MealForm from "./meal-form";

type Meal = {
  _id: string;
  mealNumber: number;
  startTime: string;
  endTime: string;
};

const CreateMeals: React.FC = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`/api/meals/mealbyeventid/${eventId}`)
      .then((res) => setMeals(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  if (id?.length !== 24 || eventId?.length !== 24) {
    return <p className="text-red-500 text-center mt-10">Invalid parameters provided.</p>;
  }

  return (
    <div className="min-h-screen bg-[#fff8f3] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold text-orange-600 mb-6">
          Catering Service &gt;&gt; Request Quotation &gt;&gt; Create Meals
        </h2>

        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search meal..."
            className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={() => setShowModal(true)}
            className="ml-4 px-5 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition"
          >
            + Create New Meal
          </button>
        </div>

        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">My Event's Meals</h3>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {meals.map((meal, idx) => (
              <div
                key={meal._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-200 border border-gray-100"
              >
                <h4 className="font-semibold text-lg text-orange-600 mb-2">Meal #{idx + 1}</h4>
                <p className="text-sm text-gray-700">
                  <strong>Start Time:</strong>{" "}
                  {new Date(meal.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>End Time:</strong>{" "}
                  {new Date(meal.endTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No meals added yet.</p>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div
              ref={modalRef}
              className="bg-white rounded-xl p-8 w-full max-w-xl mx-4 shadow-2xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
              <h4 className="text-xl font-semibold mb-4 text-orange-600">
                Add a New Meal
              </h4>
              {id && eventId ? (
                <MealForm id={id} eventId={eventId} />
              ) : (
                <p className="text-red-500">Invalid parameters provided.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeals;
