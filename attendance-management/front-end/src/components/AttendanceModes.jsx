import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { BsQrCode, BsCamera } from "react-icons/bs";
import { MdGpsFixed } from "react-icons/md";
import { useNavigate } from "react-router";

const AttendanceModes = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        punchIn: false,
        selfieAttendance: false,
        qrAttendance: false,
        gpsAttendance: false,
    });
    const [attendanceFrom, setAttendanceFrom] = useState();

    const toggleOption = (option) => {
        setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    };

    const handleBackClick = () => {
        navigate("/attendancedetails");
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-gray-800 text-white p-4 text-lg font-bold flex items-center">
                <button onClick={handleBackClick}>
                    <FaArrowLeft size={20} className="inline mr-2" />
                </button>
                Attendance Modes
            </div>

            <div className="bg-white p-4 rounded-lg shadow mt-4">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-blue-100">
                    <span className="font-medium">Allow punch in from Staff App</span>
                    <Switch
                        checked={options.punchIn}
                        onChange={() => toggleOption("punchIn")}
                        className={`${options.punchIn ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span className={`${options.punchIn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`} />
                    </Switch>
                </div>

                <div className="mt-4 space-y-4">
                    {[{ label: "Selfie Attendance", icon: <BsCamera />, key: "selfieAttendance" },
                    { label: "QR Attendance", icon: <BsQrCode />, key: "qrAttendance" },
                    { label: "GPS Attendance", icon: <MdGpsFixed />, key: "gpsAttendance" }].map(({ label, icon, key }) => (
                        <div key={key} className="flex justify-between items-center p-3 rounded-lg">
                            <span className="flex items-center gap-2">{icon} {label}</span>
                            <Switch
                                checked={options[key]}
                                onChange={() => toggleOption(key)}
                                className={`${options[key] ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className={`${options[key] ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`} />
                            </Switch>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mt-4">
                <span className="font-medium">Mark attendance from</span>
                <div className="mt-2 space-y-2">
                    {[{ label: "From Office", value: "office" },
                    { label: "From Anywhere", value: "anywhere" }].map(({ label, value }) => (
                        <label key={value} className={`flex items-center gap-2 p-3 border rounded-lg ${attendanceFrom === value ? "bg-blue-100" : ""}`}>
                            <input
                                type="radio"
                                name="attendanceFrom"
                                value={value}
                                checked={attendanceFrom === value}
                                onChange={() => setAttendanceFrom(value)}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceModes;