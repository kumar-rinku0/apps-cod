"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

interface Caterer {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  about: string;
  accountHolder: string;
  accountNumber: string;
  address: string;
  bankName: string;
  billingAddress: string;
  branchName: string;
  city: string;
  country: string;
  createdAt: string;
  estDate: string | null;
  gst: string;
  ifscCode: string;
  isActive: string;
  logo: string;
  pan: string;
  postalCode: string;
  proprietorName: string;
  state: string;
  uniqueURL: string;
  website: string;
}

const CatererList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caterer, setCaterer] = useState<Caterer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Caterer>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  const fetchCaterer = () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    axios
      .get(`/api/caterers/getbyuserid/${id}`)
      .then((res) => {
        console.log(res.data);
        const catererInfo = res.data.caterer;
        const {email} = catererInfo.userId;
        setCaterer({...catererInfo, email: email});
        setFormData({...catererInfo, email: email});
      })
      .catch((err) => {
        console.error(err);
        setMessage({
          text: "Failed to fetch caterer details. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCaterer();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ text: "", type: "" });

    const formDataToSend = new FormData();
    if (logoFile) {
      formDataToSend.append('logo', logoFile);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'logo') {
        formDataToSend.append(key, value.toString());
      }
    });

    try {
      const response = await axios.put(`/api/caterers/update/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaterer(response.data.caterer);
      setMessage({
        text: "Caterer updated successfully!",
        type: "success",
      });
      setTimeout(() => setIsEditing(false), 1500);
    } catch (error: any) {
      let errorMessage = "Failed to update caterer. Please try again.";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Validation error. Please check your inputs.";
        } else if (error.response.status === 404) {
          errorMessage = "Caterer not found.";
        }
      }
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.delete(`/api/caterers/delete/${id}`);
      setMessage({
        text: "Caterer deleted successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/caterers"), 1500);
    } catch (error: any) {
      let errorMessage = "Failed to delete caterer. Please try again.";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 404) {
          errorMessage = "Caterer not found.";
        }
      }
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading caterer details...</div>;
  if (!caterer) return <div className="text-center py-8">No caterer found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-700 p-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Edit Caterer</h1>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setMessage({ text: "", type: "" });
                }}
                className="px-4 py-2 bg-white text-indigo-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                  <FormField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Proprietor Name"
                    name="proprietorName"
                    value={formData.proprietorName || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Address Information</h2>
                  <FormField
                    label="Address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="State"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Details</h2>
                  <FormField
                    label="Established Date"
                    name="estDate"
                    type="date"
                    value={formData.estDate ? new Date(formData.estDate).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="GST Number"
                    name="gst"
                    value={formData.gst || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="PAN Number"
                    name="pan"
                    value={formData.pan || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Unique URL"
                    name="uniqueURL"
                    value={formData.uniqueURL || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Bank Details</h2>
                  <FormField
                    label="Account Holder"
                    name="accountHolder"
                    value={formData.accountHolder || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Account Number"
                    name="accountNumber"
                    value={formData.accountNumber || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Branch Name"
                    name="branchName"
                    value={formData.branchName || ''}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Logo Upload */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Logo</h2>
                  <div className="flex items-center space-x-4">
                    {caterer.logo && (
                      <img
                        src={caterer.logo}
                        alt="Current logo"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Upload new logo</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-4 md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">About</h2>
                  <textarea
                    name="about"
                    value={formData.about || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? 'Updating...' : 'Update Caterer'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-700 p-6 flex justify-between items-center">
              <div className="flex items-center">
                {caterer.logo && (
                  <img
                    src={caterer.logo}
                    alt={`${caterer.companyName} logo`}
                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">{caterer.companyName}</h1>
                  <p className="text-indigo-200">{caterer.proprietorName}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-indigo-700 rounded-md hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete {caterer.companyName}? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h2>
                <InfoItem label="Email" value={caterer.email} />
                <InfoItem label="Phone" value={caterer.phone} />
                <InfoItem label="Website" value={caterer.website} />
                <InfoItem label="Address" value={caterer.address} />
                <InfoItem label="City" value={caterer.city} />
                <InfoItem label="State" value={caterer.state} />
                <InfoItem label="Country" value={caterer.country} />
                <InfoItem label="Postal Code" value={caterer.postalCode} />
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Details</h2>
                <InfoItem label="Established Date" value={caterer.estDate} />
                <InfoItem label="GST Number" value={caterer.gst} />
                <InfoItem label="PAN Number" value={caterer.pan} />
                <InfoItem label="Status" value={caterer.isActive} />
                <InfoItem label="Unique URL" value={caterer.uniqueURL} />
                <InfoItem label="Created At" value={new Date(caterer.createdAt).toLocaleDateString()} />
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Bank Details</h2>
                <InfoItem label="Account Holder" value={caterer.accountHolder} />
                <InfoItem label="Account Number" value={caterer.accountNumber} />
                <InfoItem label="Bank Name" value={caterer.bankName} />
                <InfoItem label="Branch Name" value={caterer.branchName} />
                <InfoItem label="IFSC Code" value={caterer.ifscCode} />
              </div>

              {/* About Section */}
              <div className="space-y-4 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">About</h2>
                <p className="text-gray-700">{caterer.about || "No description provided"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-900">{value || "Not provided"}</p>
  </div>
);

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default CatererList;