import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router";

const AutomationRules = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState({
        autoPresent: false,
        presentOnPunchIn: false,
    });

    const [settings, setSettings] = useState({
        autoHalfDay: "Not Set",
        mandatoryHalfDay: "Not Set",
        mandatoryFullDay: "Not Set",
    });

    const toggleOption = (option) => {
        setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    };

    const handleSettingChange = (key) => {
        const newValue = prompt("Enter value:", settings[key]);
        if (newValue !== null) {
            setSettings((prev) => ({ ...prev, [key]: newValue }));
        }
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
                Automation Rules
            </div>

            <div className="bg-white p-4 rounded-lg shadow mt-4 space-y-4">
                <div className="flex justify-between items-center p-3  rounded-lg">
                    <span>Auto Present at day start</span>
                    <Switch
                        checked={options.autoPresent}
                        onChange={() => toggleOption("autoPresent")}
                        className={`${options.autoPresent ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span
                            className={`${options.autoPresent ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                </div>

                <div className="flex justify-between items-center p-3  rounded-lg">
                    <span>Present on Punch In</span>
                    <Switch
                        checked={options.presentOnPunchIn}
                        onChange={() => toggleOption("presentOnPunchIn")}
                        className={`${options.presentOnPunchIn ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span
                            className={`${options.presentOnPunchIn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mt-4 space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3  rounded-lg">
                        <span>{
                            key === "autoHalfDay" ? "Auto half day if late by" :
                                key === "mandatoryHalfDay" ? "Mandatory half day hours" :
                                    "Mandatory full day hours"
                        }</span>
                        <button onClick={() => handleSettingChange(key)} className="bg-gray-200 px-3 py-1 rounded">
                            {value}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AutomationRules;
