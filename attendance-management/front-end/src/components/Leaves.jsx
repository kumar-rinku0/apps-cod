import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";

const Leaves = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("request");
  const [content, setContent] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    privilege: 0,
    sick: 0,
    casual: 0
  });
  const navigate = useNavigate();

  const handleGetPendingRequest = (userId) => {
    axios.get(`/api/leaves/oneuserpending?userId=${userId}`)
      .then(res => {
        console.log(res.data);
        const leaves = res.data.leaves;
        setContent(leaves.length === 0 ? [] : leaves);
      })
      .catch(err => {
        console.log("Error fetching pending leaves:", err);
      });
  }

  const handleGetOneUserAllNotPending = (userId) => {
    axios.get(`/api/leaves/oneusernotpending?userId=${userId}`)
      .then((res) => {
        console.log(res.data);
        const leaves = res.data.leaves;
        setContent(leaves.length === 0 ? [] : leaves);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (user) {
      if (activeTab === "request") {
        handleGetPendingRequest(user._id);
      }
    }
  }, [user, activeTab]);

  const handleLeaveClick = () => {
    navigate("/leavesform");
  };

  const handleActiveTab = (tabName) => {
    if (tabName === "history") {
      handleGetOneUserAllNotPending(user._id);
    } else if (tabName === "request") {
      handleGetPendingRequest(user._id);
    }
    setActiveTab(tabName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1a1a2e] to-[#16213e] flex flex-col items-center p-8 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Leave Requests
      </h2>
      {/* 
        leave balance component code.

       <div>
        <h3 className="text-xl font-semibold mb-4">Leave Balance</h3>
        <div className="flex justify-between text-lg mb-6">
          <div>
            <p className="font-semibold">Privilege</p>
            <p className="text-gray-300">{leaveBalance.privilege}</p>
          </div>
          <div>
            <p className="font-semibold">Sick Leave</p>
            <p className="text-gray-300">{leaveBalance.sick}</p>
          </div>
          <div>
            <p className="font-semibold">Casual Leave</p>
            <p className="text-gray-300">{leaveBalance.casual}</p>
          </div>
        </div>
      </div> */}
      <div className="w-[400px] h-[300px] bg-white/10 backdrop-blur-lg rounded-xl shadow-md p-6 flex flex-col justify-between">
        {/* Tabs */}
        <div className="flex justify-between border-b border-gray-400 pb-3">
          <button
            className={`text-xl font-semibold flex-1 text-center p-3 cursor-pointer ${activeTab === "request" ? "text-white" : "text-gray-400"
              }`}
            onClick={() => handleActiveTab("request")}
          >
            REQUEST
          </button>
          <button
            className={`text-xl font-semibold flex-1 text-center p-3 cursor-pointer ${activeTab === "history" ? "text-white" : "text-gray-400"
              }`}
            onClick={() => handleActiveTab("history")}
          >
            HISTORY
          </button>
        </div>

        {/* Content Based on Tab Selection */}
        {activeTab === "request" ? (
          <LeaveCards
            cards={content}
          />
        ) : (
          <LeaveCards cards={content} />
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLeaveClick}
        className="mt-8 bg-red-400 text-white w-[400px] h-[60px] rounded-xl shadow-lg text-xl font-semibold cursor-pointer"
      >
        Request Leave
      </motion.button>
    </div>
  );
};


const LeaveCards = ({ cards }) => {
  const navigate = useNavigate();
  if (cards.length === 0) {
    return (
      <div className="text-center flex flex-col justify-center flex-grow">
        <h3 className="text-xl font-semibold">No Records Found</h3>
        <p className="text-lg text-gray-400">No leave history available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[220px] pr-3">
      {cards.map((card) => (
        <LeaveCard
          key={card._id}
          leaveType={card.leaveType}
          fromDate={card.fromDate}
          toDate={card.toDate}
          status={card.status}
          reason={card.reason}
          approvedOn={card.approvedOn}
          requestedOn={card.requestedOn}
          onClick={() => navigate("/leavedetails", { state: card })}
        />
      ))}
    </div>
  );
};

const LeaveCard = ({
  leaveType,
  fromDate,
  toDate,
  status,
  reason,
  approvedOn,
  requestedOn,
  onClick
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">{leaveType}</h4>
          <p className="text-base text-gray-300">
            {formatDate(fromDate)} - {formatDate(toDate)}
          </p>
        </div>
        <span className={`px-3 py-2 rounded text-sm ${status === 'Approved' ? 'bg-green-500/80' :
          status === 'Rejected' ? 'bg-red-500/80' : 'bg-yellow-500/80'
          }`}>
          {status}
        </span>
      </div>

      <p className="text-base mt-3 text-gray-300">{reason}</p>

      <div className="flex justify-between text-sm mt-3 text-gray-400">
        <span>Requested: {formatDate(requestedOn)}</span>
        {status === 'Approved' && (
          <span>Approved: {formatDate(approvedOn)}</span>
        )}
      </div>
    </div>
  );
};

export default Leaves;
