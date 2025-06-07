import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateStaff = ({ branchId }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
    shiftStartTime: "09:30",
    shiftEndTime: "18:30",
    shiftType: "morning",
    workDays: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false,
    },
  });
  const [userId, setUserId] = useState(null);
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        workDays: {
          ...prev.workDays,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (userId) {
      console.log(formData);
      axios
        .post("/api/shift/create", {
          shiftType: formData.shiftType,
          shiftStartTime: formData.shiftStartTime,
          shiftEndTime: formData.shiftEndTime,
          workDays: formData.workDays,
          userId: userId,
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.response.data.error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  const [loading, setLoading] = useState(false);
  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isAuthenticated && user && user.roleInfo) {
      console.log(formData);

      setLoading(true);

      axios
        .post("/api/user/signupwithrole", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          companyId: user.roleInfo.company,
          branchId,
        })
        .then((res) => {
          console.log(res);
          setUserId(res.data.user._id);
          setShowSecondPart(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message || err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleShiftTypeChange = (type) => {
    let startTime, endTime;
    switch (type) {
      case "morning":
        startTime = "09:00";
        endTime = "17:00";
        break;
      case "evening":
        startTime = "14:00";
        endTime = "22:00";
        break;
      case "night":
        startTime = "22:00";
        endTime = "06:00";
        break;
      default:
        startTime = "09:00";
        endTime = "17:00";
    }
    setFormData((prev) => ({
      ...prev,
      shiftType: type,
      shiftStartTime: startTime,
      shiftEndTime: endTime,
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    if (name === "shiftStartTime") {
      const [hours, minutes] = value.split(":").map(Number);
      let endHours = hours + 9;
      let endMinutes = minutes;

      if (endHours >= 24) {
        endHours -= 24;
      }

      const formattedEndHours = endHours.toString().padStart(2, "0");
      const formattedEndMinutes = endMinutes.toString().padStart(2, "0");
      const endTime = `${formattedEndHours}:${formattedEndMinutes}`;

      setFormData((prev) => ({
        ...prev,
        shiftStartTime: value,
        shiftEndTime: endTime,
      }));
    } else {
      handleChange(e);
    }
  };

  const handlePresetWorkDays = (preset) => {
    let newWorkDays;
    switch (preset) {
      case "Mon-Fri":
        newWorkDays = {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: false,
          Sunday: false,
        };
        break;
      case "Mon-Sat":
        newWorkDays = {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
          Sunday: false,
        };
        break;
      case "All":
        newWorkDays = {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
          Sunday: true,
        };
        break;
      default:
        newWorkDays = formData.workDays;
    }
    setFormData((prev) => ({
      ...prev,
      workDays: newWorkDays,
    }));
  };

  return (
    <div className="min-w-full min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Create Employee/Manager
        </h2>
        <form onSubmit={handleSubmit}>
          {!showSecondPart ? (
            <>
              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                  placeholder="Employee/Manager Email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Role
                </label>
                <div className="flex flex-wrap gap-3">
                  {["employee", "manager", "admin"].map((role) => (
                    <label key={role} className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#e94560] focus:ring-[#e94560] border-white/20"
                      />
                      <span className="ml-2 text-white/80 text-sm capitalize">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg flex items-center justify-center transition-all hover:from-red-600 hover:to-red-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-lg hover:shadow-red-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 border-2 border-white border-opacity-30 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-t-white border-r-white border-opacity-90 rounded-full animate-spin"></div>
                    </div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Next"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Work Days
                </label>

                <div className="flex space-x-2 mb-3">
                  <button
                    type="button"
                    onClick={() => handlePresetWorkDays("Mon-Fri")}
                    className={`px-2 py-1 text-xs rounded ${
                      Object.values(formData.workDays).filter(Boolean)
                        .length === 5 &&
                      !formData.workDays.Saturday &&
                      !formData.workDays.Sunday
                        ? "bg-[#e94560] text-white"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    Mon-Fri
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetWorkDays("Mon-Sat")}
                    className={`px-2 py-1 text-xs rounded ${
                      Object.values(formData.workDays).filter(Boolean)
                        .length === 6 && !formData.workDays.Sunday
                        ? "bg-[#e94560] text-white"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    Mon-Sat
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetWorkDays("All")}
                    className={`px-2 py-1 text-xs rounded ${
                      Object.values(formData.workDays).every((day) => day)
                        ? "bg-[#e94560] text-white"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    All Days
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.workDays).map(([day, checked]) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={day}
                        checked={checked}
                        onChange={handleChange}
                        className="h-4 w-4 rounded bg-white/10 border-white/20 focus:ring-[#e94560]"
                      />
                      <span className="text-white/80 text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Shift Type
                </label>
                <div className="flex flex-wrap gap-3">
                  {["morning", "evening", "night"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleShiftTypeChange(type)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        formData.shiftType === type
                          ? "bg-[#e94560] text-white"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Shift Times
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-white/60 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="shiftStartTime"
                      value={formData.shiftStartTime}
                      onChange={handleTimeChange}
                      className="w-full px-3 py-2 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-white/60 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="shiftEndTime"
                      value={formData.shiftEndTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSecondPart(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                    isSubmitting
                      ? "bg-[#e94560]/70 text-white/70 cursor-not-allowed"
                      : "bg-[#e94560] text-white hover:bg-[#d8344f] focus:ring-[#e94560]"
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const ShowBranches = () => {
  const { isAuthenticated, user } = useAuth();
  const [next, setNext] = useState({ isNext: false, branchId: null });
  const [branches, setBranches] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.company) {
      axios
        .get(`/api/branch/${user.company._id}`)
        .then((res) => {
          setBranches(res.data.branches);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleSetNext = (branchId) => {
    setNext({ isNext: true, branchId: branchId });
  };

  if (isLoading) {
    return (
      <div className="min-w-full min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm z-10 border border-white/10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e94560]"></div>
          </div>
          <p className="text-center text-white mt-4">Loading branches...</p>
        </div>
      </div>
    );
  }

  if (next.isNext) {
    return <CreateStaff branchId={next.branchId} />;
  }

  return (
    <div className="min-w-full min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md z-10 border border-white/10">
        <h2 className="text-xl font-bold mb-6 text-center text-white">
          Select Branch
        </h2>
        <div className="space-y-4">
          {branches && branches.length > 0 ? (
            branches.map((branch) => (
              <SingleBranch
                branch={branch}
                handleSetNext={handleSetNext}
                key={branch._id}
              />
            ))
          ) : (
            <div className="text-center text-white/80 py-4">
              No branches available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SingleBranch = ({ branch, handleSetNext }) => {
  return (
    <button
      onClick={() => handleSetNext(branch._id)}
      className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/10 flex flex-col items-start"
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold text-white">
          {branch.branchName}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white/60"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {branch.address && (
        <p className="text-sm text-white/60 mt-1 text-left">{branch.address}</p>
      )}
    </button>
  );
};

export default ShowBranches;
