import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";

import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";

const CurrentEmp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: user.company.companyName || "Not Aailable",
    companyCode: user.company.companyCode || "Not Aailable",
    branchName: "",
    branchAddress: "",
    attendanceRadius: "",
    deparment: "Not Aailable",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchBranchInfo();
  }, []);

  const fetchBranchInfo = () => {
    axios
      .get("/api/branch/info")
      .then((res) => {
        console.log(res);
        const { branchName, branchAddress, attendanceRadius } = res.data.branch;
        setFormData((prev) => ({
          ...prev,
          branchName: branchName,
          branchAddress: branchAddress,
          attendanceRadius: attendanceRadius,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBackClick = () => {
    navigate("/profilepage");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBackClick}>
          <FaArrowLeft size={20} className="inline mr-2" />
        </button>
        <h2 className="text-xl font-semibold">Current Employment</h2>
      </div>

      {/* Form Fields */}

      <div className="mt-2">
        <label className="block text-gray-600">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mt-2">
        <label className="block text-gray-600">Company Code</label>
        <input
          type="text"
          name="companyCode"
          value={formData.companyCode}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mt-2">
        <label className="block text-gray-600">Branch Name</label>
        <input
          type="text"
          name="branchName"
          value={formData.branchName}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mt-2">
        <label className="block text-gray-600">Branch Address</label>
        <input
          type="text"
          name="branchAddress"
          value={formData.branchAddress}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mt-2">
        <label className="block text-gray-600">Attendance Radius</label>
        <input
          type="text"
          name="attendanceRadius"
          value={formData.attendanceRadius}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mt-2">
        <label className="block text-gray-600">Department</label>
        <input
          type="text"
          name="department"
          value={formData.deparment}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default CurrentEmp;
