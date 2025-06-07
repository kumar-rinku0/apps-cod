import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import QuaReqDialog from "./partials/quo-req-dialog";

interface MealItemProps {
  _id: string;
  price: number;
  name: string;
  description: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
}

interface MealProps {
  _id: string;
  mealType: string;
  startTime: string;
  endTime: string;
  items: MealItemProps[];
}

const MealPreview: React.FC = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    quotationId: string | null;
    eventName: string | null;
  }>({ isOpen: false, quotationId: null, eventName: null });
  const [meals, setMeals] = useState<MealProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/meals/mealbyeventid/${eventId}`)
      .then((res) => {
        setMeals(res.data);
      })
      .catch((err) => {
        console.error("Error fetching meal data", err);
      });
  }, []);

  // const handleSendQuotation = () => {
  //   axios
  //     .post("/api/quotation/create", {
  //       userId: id,
  //       eventId: eventId,
  //     })
  //     .then((res) => {
  //       const { quotation, event } = res.data;
  //       setDialog({
  //         isOpen: true,
  //         quotationId: quotation.quotationId,
  //         eventName: event.eventName,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleCloseDialog = () => {
    setDialog((prev) => ({
      ...prev,
      isOpen: false,
      quotationId: null,
      eventName: null,
    }));
    navigate(`/${id}/customer`);
  };

  if (!meals.length) return <p className="text-center p-6 text-gray-600">No meals found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-[#fffdf9]">
      <h2 className="text-center text-3xl font-bold text-orange-600 mb-8">🍽️ Meal Preview</h2>

      {meals.map((meal, idx) => (
        <div
          key={meal._id}
          className="border rounded-xl shadow-md p-6 bg-white relative hover:shadow-lg transition"
        >
          <button className="absolute top-4 right-4 text-orange-500 hover:text-orange-700">
            <Pencil size={18} />
          </button>

          <div className="mb-4">
            <p className="font-semibold text-orange-600">#Meal-{idx + 1}</p>
            <p className="text-gray-700">🍱 Type: <strong>{meal.mealType}</strong></p>
            <p className="text-sm text-gray-600">
              ⏰ <strong>Start:</strong> {new Date(meal.startTime).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-600">
              ⏳ <strong>End:</strong> {new Date(meal.endTime).toLocaleTimeString()}
            </p>
          </div>

          {meal.items.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(
                meal.items.reduce<Record<string, MealItemProps[]>>((acc, item) => {
                  const cat = item.category.name;
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(item);
                  return acc;
                }, {})
              ).map(([categoryName, items]) => (
                <div key={categoryName} className="border p-4 rounded-lg bg-[#fff8f0] shadow-sm">
                  <h3 className="text-lg font-semibold text-orange-700 mb-3 border-b pb-1">
                    🍽️ {categoryName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <div key={item._id} className="bg-white border rounded-md p-3 shadow-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items selected for this meal.</p>
          )}
        </div>
      ))}

      {/* Add New Meal Card */}
      <div
        onClick={() => navigate(`/${id}/${eventId}/create-meal`)}
        className="mt-6 border-2 border-dashed border-orange-300 rounded-xl p-10 text-center text-orange-500 hover:bg-orange-50 cursor-pointer transition"
      >
        <p className="text-5xl mb-2 font-light">+</p>
        <p className="text-lg font-medium">Add Another Meal</p>
      </div>

      {/* Send Quotation */}
      <div className="mt-8 flex justify-end">
        {/* <button
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          onClick={handleSendQuotation}
        >
          Send Quotation
        </button> */}
        <QuaReqDialog
          isOpen={dialog.isOpen}
          quotationId={dialog.quotationId || ""}
          eventName={dialog.eventName || ""}
          closeDialog={handleCloseDialog}
        />
      </div>
    </div>
  );
};

export default MealPreview;
// ok

//ok 2