import React, { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { FaArrowLeft, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { Card, CardContent } from "@mui/material";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import DialogComp from "./partials/DialogComp";

const EditAttendance = () => {
  const { user } = useAuth();
  const { firstName, lastName } = user;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedDate,
    status: initialStatus,
    month,
    id,
  } = location.state || {};

  const date = selectedDate?.split("/")[0] || "";
  const currentMonth = new Date(new Date().getFullYear(), month).toLocaleString(
    "en-IN",
    { month: "long" }
  );

  const [info, setInfo] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [editTime, setEditTime] = useState({ in: false, out: false });
  const [note, setNote] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Store clicked photo URL

  const handleOpen = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const handleClose = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    if (id.attendanceId) {
      handleGetAttendance(id.attendanceId);
      handleFetchNotes(id.attendanceId);
    }
  }, [id.attendanceId]);

  const handleGetAttendance = (attendanceId) => {
    axios
      .get(`/api/attendance/attendancebyid/${attendanceId}`)
      .then((res) => setInfo(res.data.attendance.punchingInfo))
      .catch(console.log);
  };

  const handleFetchNotes = (attendanceId) => {
    axios
      .get(`/api/notes/${attendanceId}`)
      .then((res) => setAllNotes(res.data.notes))
      .catch((err) => console.error("Error fetching notes:", err));
  };

  const handleNoteSubmit = () => {
    if (!note.trim()) return;

    axios
      .post("/api/notes/add", {
        attendanceId: id.attendanceId,
        content: note,
        employeeId: user._id,
      })
      .then((res) => {
        console.log(res.data);
        setNote("");
        handleFetchNotes(id.attendanceId);
      })
      .catch((err) => {
        console.error("Error adding note:", err);
      });
  };

  const handleStatusChange = (statusInfo) => {
    setSelectedStatus(statusInfo);
    if (statusInfo !== "week off") {
      axios
        .patch("/api/attendance/update", {
          ...id,
          status: statusInfo,
          date: selectedDate,
          month: currentMonth,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleEditClose = () => {
    setEditTime({ in: false, out: false });
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-lg font-bold flex items-center rounded-t-lg shadow-md">
        <button onClick={() => navigate(-1)} className="mr-2">
          <FaArrowLeft size={20} />
        </button>
        {`${firstName} ${lastName}`}: Edit Attendance
      </div>

      <div className="mt-4">
        <h3 className="font-medium">
          {date}th {currentMonth}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            variant="outline"
            className={`py-1 px-2 border border-red-500 rounded-2xl ${
              selectedStatus === "absent"
                ? "bg-red-500 text-white"
                : "text-red-500"
            }`}
            onClick={() => handleStatusChange("absent")}
          >
            ABSENT
          </Button>
          <Button
            variant="outline"
            className={`py-1 px-2 border border-yellow-500 rounded-2xl ${
              selectedStatus === "half day"
                ? "bg-yellow-500 text-white"
                : "text-yellow-500"
            }`}
            onClick={() => handleStatusChange("half day")}
          >
            HALF DAY
          </Button>
          <Button
            variant="outline"
            className={`py-1 px-2 border border-green-500 rounded-2xl ${
              selectedStatus === "on time" || selectedStatus === "late"
                ? "bg-green-500 text-white"
                : "text-green-500"
            }`}
            onClick={() => handleStatusChange("on time")}
          >
            PRESENT
          </Button>
          <Button
            variant="outline"
            className={`py-1 px-2 border border-gray-500 rounded-2xl ${
              selectedStatus === "week off"
                ? "bg-gray-500 text-white"
                : "text-gray-500"
            }`}
            onClick={() => handleStatusChange("week off")}
          >
            WEEK OFF
          </Button>
          <Button
            variant="outline"
            className={`py-1 px-2 border border-gray-800 rounded-2xl ${
              selectedStatus === "holiday"
                ? "bg-gray-500 text-white"
                : "text-gray-500"
            }`}
            onClick={() => handleStatusChange("holiday")}
          >
            HOLIDAY
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-medium">Leaves</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button className="py-1 px-2 border border-purple-500 rounded-2xl text-purple-500">
            PAID LEAVE
          </Button>
          <Button className="py-1 px-2 border border-pink-500 rounded-2xl text-pink-500">
            HALF DAY LEAVE
          </Button>
          <Button className="py-1 px-2 border border-blue-500 rounded-2xl text-blue-500">
            UNPAID LEAVE
          </Button>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <h3 className="font-medium text-gray-700">Time Logs</h3>
        {info?.length > 0 ? (
          info.map((item, index) => (
            <Card
              key={index}
              className="rounded-lg shadow-sm border border-gray-100"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-semibold text-blue-700 flex items-center cursor-pointer">
                        <div>
                          {item?.punchInInfo?.punchInPhoto && (
                            <img
                              src={item.punchInInfo.punchInPhoto}
                              height={50}
                              width={50}
                              alt="Punch in pic"
                              style={{
                                cursor: "pointer",
                                objectFit: "cover",
                                borderRadius: "100%",
                                height: 50,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                border: "2px solid #ffffff",
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                              }}
                              onClick={() =>
                                handleOpen(item.punchInInfo.punchInPhoto)
                              }
                            />
                          )}
                        </div>

                        {selectedPhoto && (
                          <div
                            onClick={handleClose}
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1000,
                            }}
                          >
                            {/* ❌ Close Button */}
                            <button
                              onClick={handleClose}
                              style={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                background: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                fontSize: 16,
                                cursor: "pointer",
                                fontWeight: "bold",
                                boxShadow: "0 0 5px #000",
                                zIndex: 1001,
                              }}
                            >
                              ❌
                            </button>

                            <img
                              src={selectedPhoto}
                              alt="Punch in large"
                              style={{
                                maxWidth: "90%",
                                maxHeight: "90%",
                                borderRadius: 8,
                                boxShadow: "0 0 10px #fff",
                              }}
                            />
                          </div>
                        )}
                        <span className="bg-blue-100 p-1 rounded-full mr-2">
                          ⏰
                        </span>
                        <div
                          onClick={() => setEditTime({ in: true, out: false })}
                        >
                          {new Date(
                            item?.punchInInfo.visibleTime
                          ).toLocaleTimeString("en-IN")}{" "}
                          - IN
                        </div>
                      </div>
                      {item?.punchInInfo.visibleTime && editTime.in && (
                        <DialogComp
                          type={"in"}
                          id={item?.punchInInfo._id}
                          handleClose={handleEditClose}
                          date={selectedDate}
                        />
                      )}
                      {item?.punchInInfo?.punchInAddress && (
                        <p className="text-xs text-gray-600 mt-1 flex items-start">
                          <FaMapMarkerAlt
                            className="mr-1 mt-0.5 flex-shrink-0"
                            size={10}
                          />
                          {item.punchInInfo.punchInAddress}
                        </p>
                      )}
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-semibold text-green-700 flex items-center cursor-pointer">
                        <div>
                          {item?.punchOutInfo?.punchOutPhoto && (
                            <img
                              src={item.punchOutInfo.punchOutPhoto}
                              height={50}
                              width={50}
                              alt="Punch Out pic"
                              style={{
                                cursor: "pointer",
                                objectFit: "cover",
                                borderRadius: "100%",
                                height: 50,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                border: "2px solid #ffffff",
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                              }}
                              onClick={() =>
                                handleOpen(item.punchOutInfo.punchOutPhoto)
                              }
                            />
                          )}
                        </div>

                        {selectedPhoto && (
                          <div
                            onClick={handleClose}
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1000,
                            }}
                          >
                            {/* ❌ Close Button */}
                            <button
                              onClick={handleClose}
                              style={{
                                position: "absolute",
                                top: 20,
                                right: 20,
                                background: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                fontSize: 16,
                                cursor: "pointer",
                                fontWeight: "bold",
                                boxShadow: "0 0 5px #000",
                                zIndex: 1001,
                              }}
                            >
                              ❌
                            </button>

                            <img
                              src={selectedPhoto}
                              alt="Punch in large"
                              style={{
                                maxWidth: "90%",
                                maxHeight: "90%",
                                borderRadius: 8,
                                boxShadow: "0 0 10px #fff",
                              }}
                            />
                          </div>
                        )}
                        <span className="bg-green-100 p-1 rounded-full mr-2">
                          ⏰
                        </span>
                        <div
                          onClick={() => setEditTime({ in: false, out: true })}
                        >
                          {item?.punchOutInfo?.visibleTime
                            ? new Date(
                                item.punchOutInfo.visibleTime
                              ).toLocaleTimeString("en-IN")
                            : "--:--"}{" "}
                          - OUT
                        </div>
                      </div>
                      {item?.punchOutInfo?._id && editTime.out && (
                        <DialogComp
                          type={"out"}
                          id={item.punchOutInfo._id}
                          handleClose={handleEditClose}
                          date={selectedDate}
                        />
                      )}
                      {item?.punchOutInfo?.punchOutAddress && (
                        <p className="text-xs text-gray-600 mt-1 flex items-start">
                          <FaMapMarkerAlt
                            className="mr-1 mt-0.5 flex-shrink-0"
                            size={10}
                          />
                          {item.punchOutInfo.punchOutAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No time logs available
          </p>
        )}
      </div>

      {/* Add Note Section */}
      <div className="mt-6">
        <textarea
          placeholder="Add Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 resize-y min-h-[100px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        ></textarea>
        <button
          onClick={handleNoteSubmit}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Note
        </button>
      </div>
    </div>
  );
};

export default EditAttendance;
