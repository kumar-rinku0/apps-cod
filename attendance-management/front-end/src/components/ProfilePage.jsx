import {
  FaCamera,
  FaBriefcase,
  FaFingerprint,
  FaPiggyBank,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { FileText, Settings } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const ProfilePage = () => {
  const { user } = useAuth();
  const { firstName, lastName, email } = user;
  const navigate = useNavigate();

  const handlePersonalClick = () => {
    navigate("/personaldetails");
  };

  const handleCurrentClick = () => {
    navigate("/currentemp");
  };

  const handleAttendanceClick = () => {
    navigate("/attendancedetails");
  };

  const handleBankClick = () => {
    navigate("/bankdetails");
  };

  const handleBackClick = () => {
    navigate("/settings");
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="mt-4">
        <button onClick={handleBackClick}>
          <FaArrowLeft size={20} className="inline mr-2" />
        </button>
      </div>
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <div className="w-24 h-24 bg-purple-500 text-white flex items-center justify-center text-4xl font-bold rounded-full">
            S
          </div>
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
            <FaCamera size={16} className="text-gray-700" />
          </button>
        </div>
        <h2 className="text-lg font-semibold mt-2">{`${firstName} ${lastName}`}</h2>
        <p className="text-gray-600">{email}</p>
      </div>

      {/* Profile Sections */}
      <div className="space-y-2">
        <button
          onClick={handlePersonalClick}
          className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer"
        >
          <FaUser className="mr-2" /> Personal Details
        </button>
        <button
          onClick={handleCurrentClick}
          className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer"
        >
          <FaBriefcase className="mr-2" /> Current Employment
        </button>
        <button className="flex items-center w-full p-3 bg-white rounded-lg shadow relative cursor-pointer">
          <FileText className="mr-2" /> Custom Details
        </button>

        <button
          onClick={handleAttendanceClick}
          className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer"
        >
          <FaFingerprint className="mr-2" /> Attendance Details
        </button>
        <button
          onClick={handleBankClick}
          className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer"
        >
          <FaPiggyBank className="mr-2" /> Bank Details
        </button>
        <button className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer">
          <Settings className="mr-2" /> User Permission
        </button>
        <button className="flex items-center w-full p-3 bg-white rounded-lg shadow cursor-pointer">
          <FileText className="mr-2" /> Documents
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
