import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const HolidayList = () => {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [showForm, setShowForm] = useState(false);
    const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
    const [holidayList, setHolidayList] = useState([]);
    const navigate = useNavigate();


    const fetchHolidays = async (year) => {
        try {
            const res = await axios.get(`/api/add/holidays/${year}`);
            setHolidayList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHolidays(selectedYear);
    }, [selectedYear]);

    const handleAddHoliday = async () => {
        if (!newHoliday.name || !newHoliday.date) return;

        try {
            const res = await axios.post(`/api/add/holidays`, newHoliday);
            const updatedList = [...holidayList, res.data].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );
            setHolidayList(updatedList);
            setNewHoliday({ name: "", date: "" });
            setShowForm(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)} className="text-green-800">
                    <FaArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">Holiday List</h2>
                <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                    <FaCalendarAlt />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-transparent outline-none"
                    >
                        {[2025, 2024].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Holiday List */}
            <div className="flex flex-col gap-4 overflow-y-auto">
                {holidayList.length > 0 ? (
                    holidayList.map((holiday, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{holiday.date}</p>
                                <p className="text-base font-medium text-gray-800">{holiday.name}</p>
                            </div>
                            <button className="border border-green-500 text-green-500 px-4 py-1 rounded cursor-pointer">
                                ADD
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No holidays found.</p>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 space-y-3">
                <button className="w-full border border-green-500 text-green-500 py-2 rounded-md font-medium cursor-pointer">
                    Add all Public Holidays
                </button>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full text-green-700 font-medium cursor-pointer"
                >
                    {showForm ? "Cancel" : "Add New Holidays"}
                </button>
            </div>

            {/* Add Holiday Form */}
            {showForm && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Add Holiday</h3>
                    <input
                        type="text"
                        placeholder="Holiday Name"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        className="w-full border px-3 py-2 rounded mb-3"
                    />
                    <input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        className="w-full border px-3 py-2 rounded mb-4"
                    />
                    <button
                        onClick={handleAddHoliday}
                        className="w-full bg-green-400 text-white font-bold py-2 rounded cursor-pointer"
                    >
                        Add Holiday
                    </button>
                </div>
            )}
        </div>
    );
};

export default HolidayList;
