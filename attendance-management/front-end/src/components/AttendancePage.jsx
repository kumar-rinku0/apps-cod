import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { FaArrowLeft } from "react-icons/fa";
import { formatDateForComparison } from "../functions/DateFixer";

export const AttendancePage = ({ userId, branchId, companyId, name }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    paidLeave: 0,
    weekOff: 0,
  });
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const date = new Date(today.getFullYear(), selectedMonth + 1, 0);

  // Recalculate the number of days in the selected month whenever the month changes
  const daysInMonth = new Date(
    date.getFullYear(),
    selectedMonth + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    selectedMonth,
    1
  ).getDay();

  // Get day status based on the date
  const getDayStatus = (day) => {
    const currDay = new Date(date.getFullYear(), selectedMonth, day).getDay();
    const currDate = formatDateForComparison(
      new Date(date.getFullYear(), selectedMonth, day)
    );
    // Future date check for the current month
    if (selectedMonth === today.getMonth() && day > today.getDate()) {
      return { color: "bg-gray-300", status: "future" };
    }
    const info = content.find((item) => item.date === currDate);

    // Attendance status based on the fetched data
    if (info) {
      if (info.status === "on time" || info.status === "late") {
        return {
          color: "bg-green-500",
          status: info.status,
          attendanceId: info._id,
        };
      } else if (info.status === "half day") {
        return {
          color: "bg-yellow-500",
          status: "half day",
          attendanceId: info._id,
        };
      } else if (info.status === "holiday") {
        return {
          color: "bg-gray-500",
          status: "holiday",
          attendanceId: info._id,
        };
      } else if (info.status === "absent") {
        return {
          color: "bg-red-500",
          status: "absent",
          attendanceId: info._id,
        };
      }
    }
    // Weekend check (Sunday and Saturday)
    if (currDay === 0 || currDay === 6) {
      return { color: "bg-gray-500", status: "week off" };
    }

    return { color: "bg-red-500", status: "absent" };
  };

  // Fetch attendance data for the selected month
  const handleGetMonthInfo = (userId, companyId, branchId, month) => {
    axios
      .post("/api/attendance/month/information", {
        userId: userId,
        companyId: companyId,
        branchId: branchId,
        month: month,
      })
      .then((res) => {
        console.log(res.data);
        setContent([...res.data.attendance]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Fetch attendance data whenever the selected month changes
  useEffect(() => {
    if (userId && branchId && companyId && selectedMonth !== undefined) {
      const currMonth = new Date(
        today.getFullYear(),
        selectedMonth
      ).toLocaleString("en-IN", {
        month: "long",
      });
      handleGetMonthInfo(userId, companyId, branchId, currMonth);
    }
  }, [userId, branchId, companyId, selectedMonth]);

  // Calculate attendance summary whenever the data changes
  useEffect(() => {
    let presentCount = 0,
      absentCount = 0,
      halfDayCount = 0,
      weekOffCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const { status } = getDayStatus(day);
      if (status === "absent") absentCount++;
      if (status === "on time" || status === "late") presentCount++;
      if (status === "half day") halfDayCount++;
      if (status === "week off") weekOffCount++;
    }

    setAttendance({
      present: presentCount,
      absent: absentCount,
      halfDay: halfDayCount,
      paidLeave: 0, // assuming paid leave is not being tracked in this system
      weekOff: weekOffCount,
    });
  }, [content, daysInMonth, selectedMonth]);

  // Navigate to edit attendance page when a day is clicked

  const handleSelectMonth = (e) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
    const currMonth = new Date(today.getFullYear(), newMonth).toLocaleString(
      "en-IN",
      {
        month: "long",
      }
    );
    handleGetMonthInfo(userId, companyId, branchId, currMonth);
  };

  const handleDayClick = (day) => {
    const { color, status, attendanceId } = getDayStatus(day);
    if (status === "future") {
      return;
    }
    const currDate = formatDateForComparison(
      new Date(date.getFullYear(), selectedMonth, day)
    );

    navigate(`/editattendance`, {
      state: {
        selectedDate: currDate,
        status: status,
        month: selectedMonth,
        id: {
          userId: userId,
          branchId: branchId,
          companyId: companyId,
          attendanceId: attendanceId,
        },
      },
    });
  };

  return (
    <div className="px-4 py-8 md:mx-40 lg:mx-60">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-lg font-bold flex justify-between items-center rounded-t-lg shadow-md">
        <button onClick={() => navigate(-1)} className="mr-2">
          <FaArrowLeft size={20} />
        </button>
        <div className="capitalize">{name}</div>
        <select
          name="select"
          id="select"
          className="p-2"
          onChange={(e) => handleSelectMonth(e)}
          value={selectedMonth}
        >
          <option value={today.getMonth()}>
            {new Date(today.getFullYear(), today.getMonth()).toLocaleString(
              "en-IN",
              {
                month: "long",
              }
            )}
          </option>
          <option value={today.getMonth() - 1}>
            {new Date(today.getFullYear(), today.getMonth() - 1).toLocaleString(
              "en-IN",
              {
                month: "long",
              }
            )}
          </option>
        </select>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-5 gap-2 mt-4 text-center">
        {[
          {
            label: "Present",
            value: attendance.present,
            color: "bg-green-200",
            border: "border-green-500",
          },
          {
            label: "Absent",
            value: attendance.absent,
            color: "bg-red-200",
            border: "border-red-500",
          },
          {
            label: "Half day",
            value: attendance.halfDay,
            color: "bg-yellow-200",
            border: "border-yellow-500",
          },
          {
            label: "Paid Leave",
            value: attendance.paidLeave,
            color: "bg-purple-200",
            border: "border-purple-500",
          },
          {
            label: "Week Off",
            value: attendance.weekOff,
            color: "bg-gray-200",
            border: "border-gray-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-3 border-l-4 ${item.border} ${item.color} rounded-md`}
          >
            <p className="text-sm">{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="min-w-full">
        <div className="grid grid-cols-7 gap-2 text-center mt-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div key={index} className="font-medium text-gray-600">
                {day}
              </div>
            )
          )}

          {/* Empty spaces before the first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="p-3"></div>
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const { color, status } = getDayStatus(day);
            return (
              <div
                key={day}
                className={`p-1 py-4 text-xs relative rounded-md text-white font-bold cursor-pointer ${color} hover:opacity-80`}
                title={status}
                onClick={() => handleDayClick(day)}
              >
                {day}
                {status === "late" || status === "half day" ? (
                  <span className="absolute bottom-1 left-0 right-0 text-[0.6rem] capitalize font-light">
                    {status}
                  </span>
                ) : (
                  <span className="absolute bottom-1 left-0 right-0 text-[0.6rem] opacity-0">
                    {status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNotesNavigate = (userId, name) => {
    navigate("/notespage", {
      state: {
        userId,
        name,
      },
    });
  };

  if (isAuthenticated && user && user.roleInfo) {
    if (user.roleInfo.role === "employee") {
      return (
        <AttendancePage
          userId={user._id}
          companyId={user.roleInfo.company}
          branchId={user.roleInfo.branch}
          name={`${user.firstName} ${user.lastName}`}
        />
      );
    }

    const { userId, companyId, branchId, name } = location.state || {};
    return (
      <div className="flex flex-col items-center mt-8">
        <div className="flex rounded-lg shadow-lg overflow-hidden bg-white space-x-[1px]">
          <div className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold cursor-pointer transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-inner">
            Attendance
          </div>
          <div
            onClick={() => handleNotesNavigate(userId, name)}
            className="px-8 py-3 text-red-500 font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:text-red-600"
          >
            Notes
          </div>
        </div>

        <div className="mt-8 w-full rounded-xl shadow-sm overflow-hidden bg-white">
          <AttendancePage
            userId={userId}
            companyId={companyId}
            branchId={branchId}
            name={name}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default CalendarPage;
