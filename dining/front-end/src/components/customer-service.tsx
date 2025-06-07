import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

type ServiceFormData = {
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  venue: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const CustomerService: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<ServiceFormData>({
    eventName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    venue: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Basic frontend validation
    for (const key in form) {
      if ((form as any)[key] === "") {
        alert("Please fill out all fields before submitting.");
        return;
      }
    }

    axios
      .post(`/api/event/submit`, { ...form, userId: id })
      .then((res) => {
        alert("Form submitted successfully!");
        navigate(`/${id}/${res.data.event._id}/create-meal`);
      })
      .catch((err) => {
        console.error(err);
        alert("Error submitting form. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] py-16 px-4">
      <div className="max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden bg-white border border-orange-100">
        {/* Header */}
        <div className="bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center h-60 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg bg-black/30 px-6 py-2 rounded-lg">
            Plan Your Perfect Event
          </h2>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-10 bg-[#fffdfb]">
          {/* Event Info */}
          <h3 className="text-2xl font-semibold text-orange-700 mb-6 border-b pb-2">
            Event Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">-- Select Type --</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <textarea
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                rows={3}
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              ></textarea>
            </div>
          </div>

          {/* Customer Info */}
          <h3 className="text-2xl font-semibold text-orange-700 mb-6 mt-10 border-b pb-2">
            Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full mt-1 rounded-lg border px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
            >
              Continue to Meal Planning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerService;
