import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("TOKEN");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/api/user/reset?TOKEN=${token}`, { password });
            toast.success("Password reset successfully!");
            setLoading(false);
            navigate("/login");
        } catch (error) {
            toast.error("Error resetting password.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-xs z-10 border border-white/10"
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-white">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white/80 mb-1">
                            Enter your new password
                        </label>
                        <motion.input
                            whileHover={{ scale: 1.02 }}
                            whileFocus={{ scale: 1.02 }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560]"
                            placeholder="New password"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-base font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560]"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
