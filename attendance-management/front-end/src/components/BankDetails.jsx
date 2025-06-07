import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

const BankDetails = () => {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState("bank");
    const [formData, setFormData] = useState({
        accountHolder: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBackClick = () => {
        navigate('/profilepage');
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleBackClick}>
                    <FaArrowLeft size={20} className="inline mr-2" />
                </button>
                <h2 className="text-xl font-semibold">Bank Account Details</h2>
            </div>

            {/* Account Type Selection */}
            <div className="flex space-x-4 mb-4">
                <button
                    className={`w-1/2 p-3 rounded-lg border cursor-pointer ${accountType === "bank" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                    onClick={() => setAccountType("bank")}
                >
                    Bank Account
                </button>
                <button
                    className={`w-1/2 p-3 rounded-lg border cursor-pointer ${accountType === "upi" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                    onClick={() => setAccountType("upi")}
                >
                    UPI
                </button>
            </div>

            {accountType === "bank" && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600">Account Holder’s Name</label>
                        <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter Name" />
                    </div>
                    <div>
                        <label className="block text-gray-600">Account Number</label>
                        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter Account Number" />
                    </div>
                    <div>
                        <label className="block text-gray-600">Bank Name</label>
                        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter Bank Name" />
                    </div>
                    <div>
                        <label className="block text-gray-600">IFSC Code</label>
                        <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter IFSC Code" />
                    </div>
                </div>
            )}

            {accountType === "upi" && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600">UPI ID</label>
                        <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter Your UPI" />
                    </div>

                </div>
            )}


            {/* Save Button */}
            <button className="mt-6 w-full bg-green-500 text-white p-3 rounded">Save Details</button>
        </div>
    );
};

export default BankDetails;
