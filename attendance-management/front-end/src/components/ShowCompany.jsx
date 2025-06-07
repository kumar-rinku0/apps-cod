import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";

const ShowCompany = () => {
    const { isAuthenticated, user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [openCompanyId, setOpenCompanyId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            setLoading(true);
            axios
                .get(`/api/company/${user._id}`)
                .then((res) => {
                    setCompanies(res.data.companies);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, user]);

    const toggleAccordion = (companyId) => {
        if (openCompanyId === companyId) {
            setOpenCompanyId(null);
            setBranches([]);
        } else {
            setOpenCompanyId(companyId);
            setLoading(true);
            axios
                .get(`/api/branch/${companyId}`)
                .then((res) => {
                    setBranches(res.data.branches);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-sky-900 mb-8 animate-fade-in">
                    Company Details
                </h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                ) : (
                    companies.map((company) => (
                        <div
                            key={company._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-2xl animate-fade-in-up"
                        >
                            <div
                                className="p-6 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleAccordion(company._id)}
                            >
                                <h3 className="text-xl font-bold text-sky-800">{company.companyName}</h3>
                                <svg
                                    className={`w-6 h-6 transform transition-transform duration-300 ${
                                        openCompanyId === company._id ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                            {openCompanyId === company._id && (
                                <div className="px-6 pb-6 animate-slide-down">
                                    <h4 className="text-lg font-semibold text-sky-700 mb-4">Branches:</h4>
                                    {branches.length > 0 ? (
                                        <div className="space-y-4">
                                            {branches.map((branch) => (
                                                <div
                                                    key={branch._id}
                                                    className="p-4 bg-sky-50 rounded-lg border border-sky-100 transition-all duration-300 hover:bg-sky-100"
                                                >
                                                    <h5 className="font-bold text-sky-800">{branch.branchName}</h5>
                                                    <p className="text-sky-600">{branch.branchAddress}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sky-500">No branches available.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ShowCompany;