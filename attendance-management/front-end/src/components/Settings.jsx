import React, { useState } from "react";
import {
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaCalendar,
  FaBuilding,
  FaList,
  FaCodeBranch,
  FaUmbrellaBeach,
  FaListAlt,
} from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import SelectCompany from "./SelectCompany";
import { Toaster } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const [company, setCompany] = useState(false);
  const isEmployee = user?.roleInfo?.role === "employee";
  const isManager = user?.roleInfo?.role === "manager";
  const isAdmin = user?.roleInfo?.role === "admin";

  const handleCalendarClickForManager = () => {
    navigate("/attendancepage", {
      state: {
        userId: user._id,
        companyId: user.roleInfo.company,
        branchId: user.roleInfo.branch,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  };
  const handleCalendarClick = () => {
    navigate("/attendancepage");
  };
  const handleCreateClick = () => {
    navigate("/create");
  };
  const handleBranchClick = () => {
    navigate("/branch");
  };
  const handleAddStaffClick = () => {
    navigate("/staff");
  };
  const handleSetCompanyClick = () => {
    setCompany(true);
  };

  if (company) {
    return <SelectCompany />;
  }

  const handleProfileClick = () => {
    navigate("/profilepage");
  };

  // const handleLeaveClick = () => {
  //   navigate("/leavereq");
  // };

  const handleListClick = () => {
    navigate("/holidaylist");
  };

  const handleNoteClick = () => {
    navigate("/notespage")
  };

  // Logout function
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-[100vh] bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-6">
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-3 gap-4 mb-16">
        {[
          { label: "Profile", icon: <FaUser size={36} />, onClick: handleProfileClick },
          {
            label: "View Attendance",
            icon: <FaCalendar size={36} />,
            onClick: isManager ? handleCalendarClickForManager : handleCalendarClick,
            disabled: isAdmin,
          },
          {
            label: "Holiday List",
            icon: <FaListAlt size={36} />,
            onClick: handleListClick,
          },
          // {
          //   label: "Request Leave",
          //   icon: <FaUmbrellaBeach size={36} />,
          //   onClick: handleLeaveClick,
          // },
          {
            label: "Notes",
            icon: <FaHandshake size={36} />,
            onClick: handleNoteClick,
          },
          {
            label: "Create Company",
            icon: <FaBuilding size={36} />,
            onClick: handleCreateClick,
            disabled: isEmployee || isManager,
          },
          {
            label: "Change Company",
            icon: <FaBuilding size={36} />,
            onClick: handleSetCompanyClick,
          },
          {
            label: "Add Staff",
            icon: <FaList size={36} />,
            onClick: handleAddStaffClick,
            disabled: isEmployee,
          },
          {
            label: "Create Branch",
            icon: <FaCodeBranch size={36} />,
            onClick: handleBranchClick,
            disabled: isEmployee || isManager,
          },
          {
            label: "Attendance Reminder",
            icon: <FaBell size={36} />,
            onClick: () => { },
          },
          {
            label: "Logout",
            icon: <FaSignOutAlt size={36} />,
            onClick: handleLogout,
          },
        ].map(({ label, icon, onClick, disabled }, idx) => (
          <button
            key={idx}
            onClick={onClick}
            disabled={disabled}
            className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg h-[100px] cursor-pointer disabled:bg-zinc-400"
          >
            <div className="text-red-400">{icon}</div>
            <span className="mt-2 text-sm font-medium text-center">{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Settings;
