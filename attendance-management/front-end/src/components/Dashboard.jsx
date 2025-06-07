import { useEffect, useState } from "react";
import { Bell, HelpCircle, Plus, Search, Filter, User } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [content, setContent] = useState([]);
  const [count, setCount] = useState({
    punchIn: 0,
    punchOut: 0,
    absent: 0,
    total: 0,
  });
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const isEmployee = user?.roleInfo?.role === "employee";

  useEffect(() => {
    if (user && user.company && user.company._id) {
      axios
        .get(`/api/user/companyId/${user.company._id}`)
        .then((res) => {
          setContent(res.data.users);
          setCount((prev) => ({ ...prev, total: res.data.users.length }));
        })
        .catch((err) => console.log(err));

      // Fetch branches
      axios
        .get(`/api/branch/${user.company._id}`)
        .then((res) => {
          setBranches(
            Array.isArray(res.data.branches) ? res.data.branches : []
          );
        })
        .catch((err) => {
          console.log(err);
          setBranches([]);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user?.company?._id) {
      handleGetAttendance(user.company._id);
    }
  }, [user]);

  const handleGetAttendance = (companyId) => {
    axios
      .get(`/api/attendance/count/${companyId}`)
      .then((res) => {
        console.log(res.data);
        const { puchInCount } = res.data;
        setCount((prev) => ({
          ...prev,
          punchIn: puchInCount,
          absent: prev.total - puchInCount,
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = (userId, roleInfo, name) => {
    const info = roleInfo.find((item) => item.company === user.company._id);
    if (info) {
      navigate("/attendancepage", {
        state: {
          userId,
          companyId: info.company,
          branchId: info.branch,
          name,
        },
      });
    }
  };
  const handleAddStaffClick = () => {
    navigate("/staff");
  };
  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    if (branchId === "-1") {
      // Fetch all users for the company
      axios
        .get(`/api/user/companyId/${user.company._id}`)
        .then((res) => {
          setContent(res.data.users);
          setCount((prev) => ({ ...prev, total: res.data.users.length }));
        })
        .catch((err) => console.log(err));
    }
  };

  const filteredUsers = content
    ? content.filter((user) => {
        const branchFilter =
          selectedBranch && selectedBranch !== "-1"
            ? user.companyWithRole.some(
                (role) => role.branch === selectedBranch
              )
            : true;

        // Filter by search term if provided
        const searchFilter = search
          ? `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(search.toLowerCase())
          : true;

        return branchFilter && searchFilter;
      })
    : [];

  return (
    <div className="flex items-center capitalize justify-center min-h-screen bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-6">
      <div className="w-full max-w-sm bg-[#1e1e2f] rounded-xl shadow-lg overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#2a2a3f] border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold uppercase">
              {user.company.companyName.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                {user.company.companyName}
              </h1>
              <p className="text-xs text-white/70 ">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <Bell size={18} />
            </button>
            <button className="flex items-center space-x-1.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-3 py-1.5 rounded-md text-sm hover:shadow-lg transition-all">
              <HelpCircle size={16} />
              <span>Help</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 bg-[#2a2a3f] border-b border-white/10">
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-xs text-white/70">In</p>
              <p className="text-xl font-bold text-white">{count.punchIn}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/70">Out</p>
              <p className="text-xl font-bold text-white">{count.punchOut}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/70">No Punch In</p>
              <p className="text-xl font-bold text-white">{count.absent}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 text-xs">
            <p className="text-white/70">Total Staff {count.total}</p>
            <button className="flex items-center space-x-1 text-white font-medium hover:underline">
              <span>Edit Attendance</span>
              <span>&#8250;&#8250;</span>
            </button>
          </div>
        </div>

        {/* Branch Selection Dropdown */}
        <div className="p-4 bg-[#2a2a3f] border-b border-white/10">
          <label htmlFor="branch-select" className="text-white/70 text-sm">
            Select Branch:
          </label>
          <select
            id="branch-select"
            className="w-full mt-2 p-2 bg-[#1e1e2f] text-white rounded-lg outline-none"
            value={selectedBranch || ""}
            onChange={(e) => handleBranchSelect(e.target.value)}
          >
            <option value="-1">All</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="p-4 bg-[#2a2a3f] border-b border-white/10">
          <div className="flex items-center bg-[#1e1e2f] p-2 rounded-lg">
            <Search className="text-white/50" size={18} />
            <input
              type="text"
              className="flex-1 px-2 outline-none bg-transparent text-white placeholder-white/50"
              placeholder="Search employee by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Employee List */}
        <div className="p-4 bg-[#2a2a3f]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((value) => (
              <div
                key={value._id}
                className="flex items-center justify-between mb-2"
              >
                <UserComponent user={value} handleBackClick={handleBackClick} />
                {/* <Bell
                  size={18}
                  className="text-white hover:text-yellow-400 cursor-pointer ml-4"
                  onClick={() =>
                    navigate("/notespage", {
                      state: {
                        userId: value._id,
                        name: `${value.firstName} ${value.lastName}`,
                      },
                    })
                  }
                /> */}
              </div>
            ))
          ) : (
            <p className="text-white/70 text-center py-4">No employees found</p>
          )}
        </div>

        {/* CTA Section */}
        <div className="p-4 bg-[#2a2a3f]">
          <button
            className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center hover:shadow-lg transition-all cursor-pointer"
            onClick={handleAddStaffClick}
            disabled={isEmployee}
          >
            <Plus size={18} className="mr-2" />
            Add Staff
          </button>
        </div>
      </div>
    </div>
  );
};

const UserComponent = ({ user, handleBackClick }) => {
  return (
    <div
      className="flex items-center space-x-3 py-3 cursor-pointer"
      onClick={() =>
        handleBackClick(
          user._id,
          user.companyWithRole,
          `${user.firstName} ${user.lastName}`
        )
      }
    >
      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
        <User size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-white/70">
          Last login -{" "}
          {user?.lastLogin &&
            new Date(user.lastLogin).toString().substring(0, 21)}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
