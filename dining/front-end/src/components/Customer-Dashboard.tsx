import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type Quotation = {
  _id: string;
  quotationId: string;
  userId: string;
  eventId: {
    _id: string;
    eventType: string;
  };
  status: string;
  createdAt: string;
};

const CustomerDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const getStatusColor = (status: Quotation["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200 text-gray-800";
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-black-600";
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/quotation/getbyuserid/${id}`)
        .then((res) => {
          console.log(res);
          setQuotations(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  const handleDelete = async (quoId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/quotation/delete/${quoId}`);
      setQuotations((prev) => prev.filter((q) => q._id !== quoId));
      alert("Quotation deleted successfully.");
    } catch (error) {
      console.error("Failed to delete quotation:", error);
      alert("Something went wrong while deleting.");
    }
  };

  const handleQuotationClick = (quoId: string) => {
    navigate(`/${id}/${quoId}/quotation-details`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search quotation..."
          className="border rounded px-4 py-2 w-full sm:w-64"
        />
        <button
          className="border px-4 py-2 rounded hover:bg-gray-100 font-semibold"
          onClick={() => navigate(`/${id}/event`)}
        >
          + Request Quotation
        </button>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-center mb-6">
        My Requested Quotations
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quotations.map((q) => (
          <div key={q._id} className="bg-white rounded-lg shadow-md p-4">
            <div
              className="p-1 cursor-pointer"
              onClick={() => handleQuotationClick(q._id)}
            >
              <h3 className="font-bold text-lg">#{q.quotationId}</h3>
              <p className="text-sm">{q.eventId.eventType}</p>
              <p className="text-xs text-gray-500 mt-1">
                Requested: {q.createdAt}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded mt-2 inline-block ${getStatusColor(
                  q.status
                )}`}
              >
                {q.status}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button className="bg-black text-white px-4 py-1 rounded hover:opacity-90">
                Call Now
              </button>
              <button
                className="border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                onClick={() => handleDelete(q._id)}
                disabled={q.status === "Approved"}
              >
                Delete Quotation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
