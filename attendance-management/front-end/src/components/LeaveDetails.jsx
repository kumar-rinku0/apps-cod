import React from "react";
import { useLocation, useNavigate } from "react-router";
import { X, CheckCircle, ChevronLeft } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const LeaveDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { firstName, lastName } = user;
    const leave = location.state;

    if (!leave) {
        return <div className="text-center text-gray-600">No leave details available</div>;
    }


    const calculateLeaveDuration = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md relative">

                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
                    <ChevronLeft size={24} />
                </button>

                {/* Employee Name & Status */}
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{`${firstName} ${lastName}`}</h2>
                    <span
                        className={`px-3 py-1 rounded-md text-sm font-medium ${leave.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {leave.status === "Approved" ? <CheckCircle size={14} /> : <X size={14} />} {leave.status}
                    </span>
                </div>

                {/* Leave Details */}
                <div className="mt-6 space-y-4 text-gray-700">

                    {/* Leave Duration */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500">Leave Duration</h3>
                        <p className="text-sm">
                            {new Date(leave.fromDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(leave.toDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}{" "}


                        </p>

                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500">Requested For</h3>
                        <p className="text-sm">
                            ({calculateLeaveDuration(leave.fromDate, leave.toDate)} Days)
                        </p>
                    </div>

                    {/* Leave Type */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500">Leave Type</h3>
                        <p className="text-sm">{leave.leaveType}</p>
                    </div>

                    {/* Notes */}
                    {leave.reason && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500">Notes</h3>
                            <p className="text-sm">{leave.reason}</p>
                        </div>
                    )}

                    {/* Requested On */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500">Requested On</h3>
                        <p className="text-sm">
                            {new Date(leave.requestedOn).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}{" "}
                            {new Date(leave.requestedOn).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>

                    {/* Approved By & Approved On */}
                    {leave.status === "Approved" && (
                        <>
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500">Approved By</h3>
                                <p className="text-sm">{leave.approvedBy || "N/A"}</p>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-gray-500">Approved On</h3>
                                <p className="text-sm">
                                    {new Date(leave.approvedOn).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}{" "}
                                    {new Date(leave.approvedOn).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveDetails;
