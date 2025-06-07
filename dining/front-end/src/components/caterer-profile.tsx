// All imports and interfaces remain the same
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

interface CatererFormData {
  companyName: string;
  proprietorName: string;
  website: string;
  uniqueURL: string;
  about: string;
  estDate: string;
  logo: File | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  billingAddress: string;
  bankName: string;
  branchName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  gst: string;
  pan: string;
  isActive: string;
}

const initialState: CatererFormData = {
  companyName: "",
  proprietorName: "",
  website: "",
  uniqueURL: "",
  about: "",
  estDate: "",
  logo: null,
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  billingAddress: "",
  bankName: "",
  branchName: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  gst: "",
  pan: "",
  isActive: "Yes",
};

const CatererProfile: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CatererFormData>(initialState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("catererForm");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("catererForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" && files ? files[0] : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const requiredFieldsByStep: Record<number, string[]> = {
    1: ["companyName", "proprietorName", "uniqueURL", "logo", "about"],
    2: ["email"],
    4: ["gst"],
  };

  const validateFields = (fields: string[]) => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field as keyof CatererFormData];
      if (!value || (field === "logo" && !(formData.logo instanceof File))) {
        const label = field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
        errors[field] = `${label} is required.`;
      }
    });
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!submitClicked) return;

    const allRequiredFields = Array.from(
      new Set(Object.values(requiredFieldsByStep).flat())
    );
    const isValid = validateFields(allRequiredFields);

    if (!isValid) {
      setMessage({ type: "error", text: "Please fix the errors before submitting." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const form = new FormData();
    form.append("createdAt", new Date().toISOString());

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) form.append(key, value);
    });

     axios.post("/api/caterers/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        localStorage.removeItem("catererForm");
        setMessage({ type: "success", text: "Form submitted successfully!" });
        setTimeout(() => {
          navigate(`/${res.data.profile.userId}/dashboard`);
        }, 2000)
      }).
    catch ((err) => {
      setMessage({ type: "error", text: "Error submitting form. Please try again." });
      console.error(err);
    }).finally(() => {
      setLoading(false);
      setSubmitClicked(false);
    });
  };

  const next = () => {
    const currentFields = requiredFieldsByStep[step] || [];
    const isValid = validateFields(currentFields);
    if (isValid && step < 4) {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmitClick = () => {
    setSubmitClicked(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < 4) next();
    }
  };

  const renderInput = (
    label: string,
    name: keyof CatererFormData,
    type = "text"
  ) => (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {requiredFieldsByStep[step]?.includes(name) && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={formData[name] as string}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${
          formErrors[name] 
            ? "border-red-500 focus:ring-red-500 bg-red-50" 
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
      />
      {formErrors[name] && (
        <span className="text-red-600 text-xs mt-1">{formErrors[name]}</span>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Company Details</h2>
              <p className="text-gray-500 mt-2">Tell us about your catering business</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Company Name", "companyName")}
              {renderInput("Proprietor Name", "proprietorName")}
              {renderInput("Website", "website")}
              {renderInput("Unique URL", "uniqueURL")}
              <div className="md:col-span-2">
                <Label htmlFor="about" className="text-sm font-medium text-gray-700">
                  About <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${
                    formErrors.about 
                      ? "border-red-500 focus:ring-red-500 bg-red-50" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  rows={4}
                />
                {formErrors.about && <span className="text-red-600 text-xs mt-1">{formErrors.about}</span>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                  Logo <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        {formData.logo ? formData.logo.name : "Click to upload logo"}
                      </p>
                    </div>
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formErrors.logo && <span className="text-red-600 text-xs mt-1">{formErrors.logo}</span>}
              </div>
              {renderInput("Establishment Date", "estDate", "date")}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
              <p className="text-gray-500 mt-2">How can we reach you?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Email", "email", "email")}
              {renderInput("Phone", "phone", "tel")}
              {renderInput("Address", "address")}
              {renderInput("City", "city")}
              {renderInput("State", "state")}
              {renderInput("Postal Code", "postalCode")}
              {renderInput("Country", "country")}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Billing Information</h2>
              <p className="text-gray-500 mt-2">Where should we send invoices?</p>
            </div>
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700">Billing Address</Label>
              <Textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Bank Name", "bankName")}
              {renderInput("Branch Name", "branchName")}
              {renderInput("Account Holder Name", "accountHolder")}
              {renderInput("Account Number", "accountNumber")}
              {renderInput("IFSC Code", "ifscCode")}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Legal Information</h2>
              <p className="text-gray-500 mt-2">Required for tax purposes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("GST Number", "gst")}
              {renderInput("PAN Number", "pan")}
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium text-gray-700">Active Status</Label>
                <select
                  name="isActive"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
                  onChange={handleChange}
                  value={formData.isActive}
                >
                  <option value="Yes">Active</option>
                  <option value="No">Inactive</option>
                </select>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Caterer Profile</h1>
          <span className="text-sm font-medium text-gray-500">Step {step} of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          {step > 1 && (
            <Button 
              type="button" 
              onClick={prev} 
              variant="outline" 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </Button>
          )}
          <div className="flex justify-end space-x-4 ml-auto">
            {step < 4 ? (
              <Button 
                type="button" 
                onClick={next} 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmitClick}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CatererProfile;