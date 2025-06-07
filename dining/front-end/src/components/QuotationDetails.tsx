import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

interface Meal {
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  eventId: string;
  mealType: string;
  address: string;
  items: Items[];
}

type Items = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
};

interface QuotationData {
  _id: string;
  quotationId: string;
  eventId: {
    _id: string;
    eventName: string;
    eventType: string;
    email: string;
    address: string;
    venue: string;
    fullName: string;
    startDate: string;
    endDate: string;
    createAt: string;
    phone: string;
  };
  meals: Meal[];
}

const QuotationDetails: React.FC = () => {
  const { id, quotationId } = useParams<{ id: string; quotationId: string }>();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const navigate = useNavigate();

  const handleStatusUpdate = (status: string) => {
    axios
      .put(`/api/quotation/update/status/${quotation?._id}`, { status })
      .then(() => {
        alert(`Quotation ${status.toLowerCase()} successfully!`);
        navigate(`/${id}/customer`);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (id && quotationId) {
      axios
        .get(`/api/quotation/getwithmeals/${quotationId}`)
        .then((res) => {
          setQuotation({ ...res.data.quotation, meals: res.data.meals });
        })
        .catch((err) => console.log(err));
    }
  }, [id, quotationId]);

  if (!quotation) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="w-full h-screen overflow-hidden bg-[#fffdf7] text-[#333] font-sans px-4 py-2">
      {/* Breadcrumb */}
      <div className="text-sm text-[#7a7a7a] mb-2">
        Quotations &gt; Quotation Requests &gt;{" "}
        <span className="font-semibold text-[#c86c4d]">#{quotation.quotationId}</span>
      </div>

      <div className="flex gap-4 h-[calc(100%-2rem)]">
        {/* Left: Customer & Event Info */}
        <div className="w-[400px] bg-white rounded-lg shadow-md p-4 overflow-auto space-y-6">
          {/* Customer Info */}
          <div>
            <h2 className="text-lg font-bold text-[#c86c4d] mb-2">Customer Info</h2>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {quotation.eventId.fullName}</p>
              <p><strong>Phone:</strong> {quotation.eventId.phone}</p>
              <p><strong>Email:</strong> {quotation.eventId.email}</p>
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h2 className="text-lg font-bold text-[#c86c4d] mb-2">Event Info</h2>
            <div className="text-sm space-y-1">
              <p><strong>Event Name:</strong> {quotation.eventId.eventName}</p>
              <p><strong>Event Type:</strong> {quotation.eventId.eventType}</p>
              <p><strong>Venue:</strong> {quotation.eventId.venue}</p>
              <p><strong>Address:</strong> {quotation.eventId.address}</p>
              <p><strong>Start:</strong> {quotation.eventId.startDate}</p>
              <p><strong>End:</strong> {quotation.eventId.endDate}</p>
            </div>
          </div>
        </div>

        {/* Middle: Meals */}
        <div className="flex-[2] bg-white rounded-lg shadow-md p-4 overflow-auto">
          <h2 className="text-xl font-bold text-[#c86c4d] mb-3 text-center">Meals</h2>
          <div className="space-y-4">
            {quotation.meals.map((meal, index) => {
              const groupedItems = meal.items.reduce((acc: Record<string, Items[]>, item) => {
                const category = item.category?.name || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
              }, {});

              return (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold text-lg">{meal.mealType}</h3>
                  <p className="text-sm"><strong>Time:</strong> {meal.startTime} - {meal.endTime}</p>
                  <p className="text-sm"><strong>Guests:</strong> {meal.numberOfGuests}</p>
                  {meal.address && (
                    <p className="text-sm"><strong>Address:</strong> {meal.address}</p>
                  )}
                  {Object.entries(groupedItems).map(([categoryName, items]) => (
                    <div key={categoryName} className="mt-3">
                      <h4 className="text-sm font-bold text-[#B53389] mb-1">{categoryName}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2 bg-[#fffaf5] border rounded"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="text-xs leading-tight">
                              <p className="font-semibold">{item.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Reminders & Actions */}
        <div className="w-[280px] bg-[#fff6ed] rounded-lg shadow-md p-4 flex flex-col justify-between overflow-auto">
          <div>
            <h3 className="text-lg font-bold text-center text-[#c86c4d] mb-3">Reminders</h3>
            <ul className="text-sm text-[#555] mb-4 space-y-2">
              <li>✅ Confirm by <strong>May 6th</strong></li>
              <li>💵 Payment due upon confirmation.</li>
              <li>⏳ Expires after <strong>April 30th</strong></li>
              <li>📞 Call support if needed.</li>
            </ul>
            <textarea
              placeholder="Add a note..."
              className="w-full border rounded-md p-2 h-20 text-sm resize-none mb-4"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleStatusUpdate("Approved")}
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleStatusUpdate("Rejected")}
              className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700"
            >
              ❌ Reject
            </button>
            <button className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800">
              📞 Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;
