import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateCompany = () => {
  const { isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    cinNumber: "",
    gstNumber: "",
    companyAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    if (isAuthenticated && user) {
      axios
        .post("/api/company/create", { ...formData, _id: user._id })
        .then((res) => {
          console.log(res);
          const { company, roleInfo } = res.data;
          signIn({ ...user, company: company, roleInfo: roleInfo });
          toast.info(`${res.data.company.companyName} selected!`);
          navigate("/settings");
        })
        .catch((err) => {
          console.log(err);
          toast.error(`Company already exists!`);
        });
    }
  };

  return (
    <div className="min-w-full  min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      {/* Create Company Form */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Create Company
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="mb-3">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter company name"
              required
            />
          </div>

          {/* CIN Number */}
          <div className="mb-3">
            <label
              htmlFor="cinNumber"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <input
              type="text"
              id="cinNumber"
              name="cinNumber"
              value={formData.cinNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter CIN number"
            />
          </div>

          {/* GST Number */}
          <div className="mb-3">
            <label
              htmlFor="gstNumber"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter GST number"
            />
          </div>

          {/* Company Address */}
          <div className="mb-4">
            <label
              htmlFor="companyAddress"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              rows="3"
              placeholder="Enter company address"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
