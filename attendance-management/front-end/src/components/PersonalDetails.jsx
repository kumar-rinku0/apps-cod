import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const PersonalDetails = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        phone: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        bloodGroup: "",
        address: "",
        emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
            address: "",
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("emergencyContact.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [field]: value,
                },
            }));
        }
        else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBackClick = () => {
        navigate('/profilepage');
    };

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            axios.get(`/api/personal/${user._id}/get`)
                .then((res) => {
                    console.log(res.data);
                    setFormData((prev) => ({
                        ...prev,
                        ...res.data?.personals
                    }));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (user) {
            setIsLoading(true);
            axios.post("/api/personal/create", { ...formData, userId: user._id }).then((res) => {
                console.log(res);
                e.target.reset();
                setFormData({
                    name: `${user?.firstName} ${user?.lastName}`,
                    email: user?.email,
                    phone: "",
                    dob: "",
                    gender: "",
                    maritalStatus: "",
                    bloodGroup: "",
                    address: "",
                    emergencyContact: {
                        name: "",
                        relationship: "",
                        phone: "",
                        address: "",
                    }
                });


                toast.success(res.data.message);
            }).catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleBackClick}>
                    <FaArrowLeft size={20} className="inline mr-2" />
                </button>
                <h2 className="text-xl font-semibold">Personal Details</h2>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleOnSubmit} >

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600">Staff Name</label>
                        <input type="text" name="name" value={formData.name} readOnly className="w-full p-2 border rounded bg-gray-100" />
                    </div>

                    <div>
                        <label className="block text-gray-600">Personal Email ID</label>
                        <input type="email" name="email" value={formData.email} readOnly className="w-full p-2 border rounded" />
                    </div>

                    <div>
                        <label className="block text-gray-600">Phone Number</label>
                        <PhoneInput
                            country={'in'}
                            value={formData.phone}
                            onChange={(value) => setFormData({ ...formData, phone: value })}
                            inputClass="w-full p-2 border rounded"
                            containerClass="border rounded flex items-center"
                        />
                    </div>



                    <div>
                        <label className="block text-gray-600">Date Of Birth</label>
                        <div className="relative flex items-center">
                            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="flex justify-evenly border border-black py-2 w-full rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600">Current Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded bg-gray-100" />
                    </div>

                    <div>
                        <label className="block text-gray-600">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600">Marital Status</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Married">Married</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600">Blood Group</label>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B-">B-</option>
                            <option value="AB-">AB-</option>
                            <option value="AB+">AB+</option>
                            <option value="B+">B+</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600">Emergency Contact Name</label>
                        <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} className="w-full p-2 border rounded bg-gray-100" />
                    </div>

                    <div>
                        <label className="block text-gray-600">Emergency Contact Relationship</label>
                        <select name="emergencyContact.relationship" value={formData.emergencyContact.relationship} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Relation</option>
                            <option value="Father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="spouse">Spouse</option>
                            <option value="son">Son</option>
                            <option value="brother">Brother</option>
                            <option value="sister">Sister</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600">Emergency Contact Number</label>
                        <PhoneInput
                            country={'in'}
                            value={formData.emergencyContact.phone}
                            name="emergencyContact.phone"
                            onChange={(value) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: value } })}
                            inputClass="w-full p-2 border rounded"
                            containerClass="border rounded flex items-center"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600">Emergency Contact Address</label>
                        <input type="text" name="emergencyContact.address" value={formData.emergencyContact.address} onChange={handleChange} className="w-full p-2 border rounded bg-gray-100" />
                    </div>
                </div>
                {/* Save Button */}
                <button className="mt-4 w-full bg-green-500 text-white p-3 rounded" type="submit" disabled={isLoading}>{isLoading ? "submitting" : "save details"}</button>
            </form>
        </div>
    );
};

export default PersonalDetails;