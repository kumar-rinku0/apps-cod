import React, { useEffect, useState } from "react";
import StaffDialog from "./partials/staff-dialog";
import axios from "axios";

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const Staff: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<SubAdmin[]>([]);

  const fetchUsers = () => {
    axios
      .get(`/api/staff/getAll`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen font-sans">
      <main className="flex-1 bg-gray-100 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Staff &gt;&gt; Sub-Admin</h1>
          <button
            onClick={() => setDialogOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Staff
          </button>
        </header>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Id</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.address}</td>
                  <td className="p-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <StaffDialog
          isOpen={isDialogOpen}
          closeDialog={() => setDialogOpen(false)}
        />
      </main>
    </div>
  );
};

export default Staff;
