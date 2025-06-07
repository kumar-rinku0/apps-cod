import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const WorkTime = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({ ...prev, userId: user.id }));
        }
    }, [user]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error("User not authenticated");

        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/shift/create", {
                shiftType: formData.shiftType,
                shiftStartTime: formData.shiftStartTime,
                shiftEndTime: formData.shiftEndTime,
                workDays: formData.workDays,
                userId: user.id,
            });
            toast.success(response.data.message);
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating shift");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShiftTypeChange = (type) => {
        const shiftTimes = {
            morning: { shiftStartTime: "09:00", shiftEndTime: "17:00" },
            evening: { shiftStartTime: "14:00", shiftEndTime: "22:00" },
            night: { shiftStartTime: "22:00", shiftEndTime: "06:00" },
        };
        setFormData((prev) => ({
            ...prev,
            shiftType: type,
            ...shiftTimes[type],
        }));
    };

    const handlePresetWorkDays = (preset) => {
        const presets = {
            "Mon-Fri": { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false, Sunday: false },
            "Mon-Sat": { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: true, Sunday: false },
            "All": { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: true, Sunday: true },
        };
        setFormData((prev) => ({ ...prev, workDays: presets[preset] }));
    };

    return (
        <div className="min-w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-sm border border-white/10">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white/80 mb-2">Work Days</label>
                        <div className="flex space-x-2 mb-3">
                            {["Mon-Fri", "Mon-Sat", "All"].map((preset) => (
                                <button key={preset} type="button" onClick={() => handlePresetWorkDays(preset)} className="px-2 py-1 text-xs rounded bg-white/10 text-white/80 hover:bg-[#e94560] hover:text-white">
                                    {preset}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(formData.workDays).map(([day, checked]) => (
                                <label key={day} className="flex items-center space-x-2">
                                    <input type="checkbox" name={day} checked={checked} onChange={handleChange} className="h-4 w-4 rounded bg-white/10 border-white/20 focus:ring-[#e94560]" />
                                    <span className="text-white/80 text-sm">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white/80 mb-2">Shift Type</label>
                        <div className="flex flex-wrap gap-3">
                            {["morning", "evening", "night"].map((type) => (
                                <button key={type} type="button" onClick={() => handleShiftTypeChange(type)} className={`px-3 py-1 text-sm rounded-full ${formData.shiftType === type ? "bg-[#e94560] text-white" : "bg-white/10 text-white/80"}`}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white/80 mb-2">Shift Times</label>
                        <div className="flex items-center space-x-3">
                            {['shiftStartTime', 'shiftEndTime'].map((field, idx) => (
                                <div key={idx} className="flex-1">
                                    <label className="block text-xs text-white/60 mb-1">{field === 'shiftStartTime' ? 'Start Time' : 'End Time'}</label>
                                    <input type="time" name={field} value={formData[field]} onChange={handleChange} className="w-full px-3 py-2 bg-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#e94560] focus:border-transparent" required />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className={`w-full py-2 px-4 rounded-lg text-sm font-bold ${isSubmitting ? "bg-[#e94560]/70 text-white/70 cursor-not-allowed" : "bg-[#e94560] text-white hover:bg-[#d8344f]"}`}>
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkTime;