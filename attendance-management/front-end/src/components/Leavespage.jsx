import axios from "axios";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";

const formatDate = (date) => {
  const year = new Date(date).getFullYear();
  const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
  const day = ("0" + new Date(date).getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const LeavesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: "Select Leave",
    fromDate: new Date(),
    toDate: "",
    halfDay: false,
    reason: "",
  });

  const handleBackClick = () => {
    navigate("/leavereq");
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "halfDay") {
      return setFormData((prev) => ({ ...prev, [name]: !formData.halfDay }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (user) {
      e.preventDefault();
      console.log(formData);
      axios
        .post("/api/leaves/request", { ...formData, employeeId: user._id })
        .then((res) => {
          console.log(res);
          setFormData({
            leaveType: "casual leave",
            fromDate: "",
            toDate: "",
            halfDay: false,
            reason: "",
            RequestedOn: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 md:p-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-800 p-6 text-white">
          <button onClick={handleBackClick}>
            <FaArrowLeft size={20} className="inline mr-2" />
          </button>
          <h2 className="text-2xl font-bold">Request Leave</h2>
          <p className="text-gray-300">
            Fill out the form to submit your leave request
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    name="fromDate"
                    value={formatDate(formData.fromDate)}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Half Day Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 text-red-400 rounded focus:ring-red-400 border-gray-300"
                name="halfDay"
                onChange={handleChange}
              />
              <label className="ml-2 text-sm text-gray-700">
                Request leave for half day
              </label>
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type *
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 appearance-none bg-white"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <option value="Casual Leave">
                    Casual Leave (balance: 0 days)
                  </option>
                  <option value="Sick Leave">
                    Sick Leave (balance: 5 days)
                  </option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity/Paternity">
                    Maternity/Paternity
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for leave
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400"
                rows="3"
                placeholder="Enter your reason..."
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Form Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button onClick={handleBackClick}
              type="submit"
              className="px-6 py-3 bg-red-400 text-white font-medium rounded-lg hover:bg-red-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeavesPage;
