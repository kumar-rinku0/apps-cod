import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useAuth } from "../provider/auth-provider";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Textarea } from "../ui/textarea";

type InputsProp = {
  name: string;
  domain: string;
  email: string;
  owner: string;
  postalCode: string;
  registrationNumber: string;
  address: string;
  phone: string;
};

export const EditPharmacy = () => {
  const navigate = useNavigate();
  const [searchParames] = useSearchParams();
  const pharmacyId = searchParames.get("pharmacyId");
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [inputs, setInputs] = React.useState<InputsProp>({
    name: "",
    domain: "",
    email: "",
    owner: "",
    postalCode: "",
    registrationNumber: "",
    address: "",
    phone: "",
  });

  const handleGetPharmacyInfo = (pharmacyId: string) => {
    axios.get(`/api/pharmacy/getbypharmacyid/${pharmacyId}`).then((res) => {
      console.log(res.data);
      const { pharmacy } = res.data;
      setInputs(pharmacy);
    });
  };

  useEffect(() => {
    if (pharmacyId) {
      handleGetPharmacyInfo(pharmacyId);
    }
  }, [pharmacyId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const obj = Object.fromEntries(formData.entries());
    console.log("Form Data:", obj);
    if (isAuthenticated && user) {
      axios
        .put(`/api/pharmacy/update/pharmacyId/${pharmacyId}`, obj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          navigate(`/dashboard/list-pharmacy`);
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(
            err.response?.data?.message ||
              err.response?.data?.error ||
              err.message
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">
          🏥 Pharmacy Update
        </h2>
        <p className="text-gray-500">Fill in your pharmacy details below</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <Label htmlFor="name">Pharmacy Name</Label>
            <Input
              type="text"
              name="name"
              onChange={handleChange}
              value={inputs.name}
              id="name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input
              type="text"
              name="domain"
              onChange={handleChange}
              value={inputs.domain}
              id="domain"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              country={"in"}
              inputProps={{
                name: "phone",
                id: "phone",
                required: true,
              }}
              onChange={(phone) => {
                console.log(phone);
              }}
              value={inputs.phone}
              inputStyle={{ width: "100%" }}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              // onChange={handleChange}
              readOnly
              value={inputs.email}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input
              type="text"
              name="owner"
              id="owner"
              onChange={handleChange}
              value={inputs.owner}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              type="file"
              accept="image/*"
              name="logo"
              id="logo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              type="text"
              name="postalCode"
              id="postalCode"
              maxLength={8}
              minLength={6}
              required
              className="mt-1"
              onChange={handleChange}
              value={inputs.postalCode}
            />
          </div>

          <div>
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              type="text"
              name="registrationNumber"
              id="registrationNumber"
              required
              className="mt-1"
              onChange={handleChange}
              value={inputs.registrationNumber}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              name="address"
              id="address"
              rows={2}
              required
              className="mt-1"
              onChange={handleChange}
              value={inputs.address}
            />
          </div>

          <div className="flex justify-center md:col-span-2 pt-4 ">
            <Button className="cursor-pointer" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Pharmacy"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPharmacy;
