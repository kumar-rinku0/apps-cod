import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

const AttendanceDetails = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const navigate = useNavigate();


    const handleBackClick = () => {
        navigate('/profilepage');
    };

    const handleTimeClick = () => {
        navigate('/worktimings')
    }

    const handleModeClick = () => {
        navigate('/attendancemode')
    }
    const handleRulesClick = () => {
        navigate('/automationrules')
    }
    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="bg-gray-800 text-white p-4 text-lg font-bold flex items-center">
                <button onClick={handleBackClick}>
                    <FaArrowLeft size={20} className="inline mr-2" />
                </button>
                Attendance Details
            </div>

            <div className="space-y-4 mt-4 cursor-pointer">
                <div onClick={handleTimeClick} className="bg-white p-4 rounded-lg flex justify-between items-center shadow">
                    <span className="font-medium">Work Timings</span>

                </div>

                <div onClick={handleModeClick} className="bg-white p-4 rounded-lg flex justify-between items-center shadow">
                    <span className="font-medium">Attendance Modes</span>

                </div>

                <div onClick={handleRulesClick} className="bg-white p-4 rounded-lg flex justify-between items-center shadow">
                    <span className="font-medium">Automation Rules</span>

                </div>

                <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow">
                    <span className="font-medium">Staff can view own attendance</span>
                    <Switch
                        checked={isEnabled}
                        onChange={setIsEnabled}
                        className={`${isEnabled ? "bg-green-500" : "bg-gray-300"
                            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer`}
                    >
                        <span className="sr-only">Toggle attendance visibility</span>
                        <span
                            className={`${isEnabled ? "translate-x-6" : "translate-x-1"
                                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform cursor-pointer`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetails;
