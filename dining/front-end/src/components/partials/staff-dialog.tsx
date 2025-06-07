import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

interface SubAdmin {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

interface StaffDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

const StaffDialog: React.FC<StaffDialogProps> = ({ isOpen, closeDialog }) => {
  const [formData, setFormData] = useState<SubAdmin>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "SUB-ADMIN",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(`/api/staff/add`, formData)
      .then((res) => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "SUB-ADMIN",
        });
        console.log(res.data);
        toast.success(res.data.message || "success!");
        closeDialog();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || err.response.data.error);
      });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Staff</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the staff details below.
          </AlertDialogDescription>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-4 bg-white rounded"
          >
            <input
              name="name"
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              className="w-full border rounded px-3 py-2"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              className="w-full border rounded px-3 py-2"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="w-full border rounded px-3 py-2"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUB-ADMIN">SUB-ADMIN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Add Staff
            </button>
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StaffDialog;
