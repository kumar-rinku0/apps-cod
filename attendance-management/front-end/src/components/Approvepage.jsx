import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

const ApprovePage = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get("/api/leaves/allpending")
        .then((res) => {
          setLeaveList(res.data.leaves);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleApproveClick = (leaveId) => {
    axios
      .put(`/api/leaves/update/${leaveId}`, { status: "Approved" })
      .then(() => {
        alert("Leave request approved successfully!");
        setLeaveList((prev) => prev.filter((leave) => leave._id !== leaveId));
      })
      .catch((err) => console.log(err));
  };

  const handleRejectClick = (leaveId) => {
    axios
      .put(`/api/leaves/update/${leaveId}`, { status: "Rejected" })
      .then(() => {
        alert("Leave request rejected successfully!");
        setLeaveList((prev) => prev.filter((leave) => leave._id !== leaveId));
      })
      .catch((err) => console.log(err));
  };

  const renderLeaveCard = (leave) => (
    <div
      key={leave._id}
      className="bg-white shadow-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-400/40"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 rounded-full blur-2xl animate-pulse opacity-50"></div>

      <div className="mb-4 relative z-10">
        <h2 className="text-xl font-semibold text-gray-800">{leave.leaveType}</h2>
        <p className="text-sm text-gray-500">
          {leave.fromDate} to {leave.toDate} {leave.halfDay ? "(Half Day)" : ""}
        </p>
      </div>

      <div className="space-y-2 text-gray-700 relative z-10">
        <p className="text-sm">
          <span className="font-medium">Reason: </span>
          {leave.reason || "No reason provided"}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status: </span>
          <span className="capitalize">{leave.status || "Pending"}</span>
        </p>
        <p className="text-sm">
          <span className="font-medium">Requested On: </span>
          {leave.requestedOn ? new Date(leave.requestedOn).toLocaleDateString() : "N/A"}
        </p>
      </div>

      <div className="flex gap-4 mt-6 z-10 relative">
        <button
          onClick={() => handleRejectClick(leave._id)}
          className="flex-1 py-2 px-4 bg-red-400 text-white font-semibold rounded-xl transition duration-300 hover:bg-red-500 shadow-md"
        >
          ✖ Reject
        </button>
        <button
          onClick={() => handleApproveClick(leave._id)}
          className="flex-1 py-2 px-4 bg-green-500 text-white font-semibold rounded-xl transition duration-300 hover:bg-green-600 shadow-md"
        >
          ✔ Approve
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0c29] text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-red-400 hover:underline mb-6"
      >
        <ChevronLeft size={20} /> <span className="ml-1">Back</span>
      </button>

      {/* Center Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-4 bg-white/10 p-2 rounded-xl shadow-md backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === "requests"
                ? "bg-red-500 text-white shadow-inner"
                : "bg-white text-red-500 hover:bg-red-100"
              }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === "history"
                ? "bg-red-500 text-white shadow-inner"
                : "bg-white text-red-500 hover:bg-red-100"
              }`}
          >
            History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh] text-lg font-medium">
          Loading leave requests...
        </div>
      ) : activeTab === "requests" ? (
        leaveList.length === 0 ? (
          <div className="text-center text-lg text-red-200">No pending leave requests.</div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {leaveList.map(renderLeaveCard)}
          </div>
        )
      ) : (
        <div className="text-center text-lg text-red-200 mt-10">
          No history available yet.
        </div>
      )}
    </div>
  );
};

export default ApprovePage;
