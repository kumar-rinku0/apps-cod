import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "axios";

const CreateBranch = () => {
  const { isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const [allowLocation, setAllowLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    branchName: "",
    branchAddress: "",
    attendanceRadius: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    if (isAuthenticated && user) {
      axios
        .post("/api/branch/create", {
          ...formData,
          _id: user._id,
          company: user.company,
        })
        .then((res) => {
          console.log(res);
          const { branch } = res.data;
          signIn({
            ...user,
            branch: branch,
          });
          toast.info(`${res.data.branch.branchName} created!`);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError, {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 10000, // Timeout after 10 seconds if no location is found
        maximumAge: 0, // Do not use a cached position
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    console.log(`Latitude: ${lat}, Longitude: ${lon}, Accuracy: ${accuracy}`);

    if (accuracy > 50) {
      alert("GPS signal is weak, Try moving to an open area.");
      return;
    }
    setAllowLocation(true);
    setLoading(false);
    const coordinates = [lon, lat];
    const obj = { type: "Point", coordinates: coordinates };
    setFormData((prev) => ({ ...prev, branchGeometry: obj }));
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  return (
    <div className="min-w-full  min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      {/* Create Branch Form */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Create Branch
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Branch Name */}
          <div className="mb-3">
            <label
              htmlFor="branchName"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter branch name"
              required
            />
          </div>

          {/* Attendance Radius */}
          <div className="mb-3">
            <label
              htmlFor="attendanceRadius"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <input
              type="text"
              id="attendanceRadius"
              name="attendanceRadius"
              value={formData.attendanceRadius}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter attendance radius"
              required
            />
          </div>

          {/* Branch Address */}
          <div className="mb-4">
            <label
              htmlFor="branchAddress"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <textarea
              id="branchAddress"
              name="branchAddress"
              value={formData.branchAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              rows="3"
              placeholder="Enter branch address"
              required
            />
          </div>

          {/* Allow Location Access Button */}
          {!allowLocation && (
            <button
              onClick={getLocation}
              type="button"
              className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 cursor-pointer mb-4"
            >
              Allow Access
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBranch;
