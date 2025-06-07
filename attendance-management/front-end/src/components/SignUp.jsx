import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    axios
      .post("/api/user/signup", formData)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-w-full relative h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="w-64 h-64 bg-[#e94560] rounded-full absolute top-1/4 left-1/4 opacity-30"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="w-48 h-48 bg-[#0f3460] rounded-full absolute bottom-1/4 right-1/4 opacity-30"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="w-32 h-32 bg-[#533483] rounded-full absolute top-1/3 right-1/3 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* SignUp Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-xs z-10 border border-white/10"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
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

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
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

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            ></label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-base font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 cursor-pointer"
          >
            SIGN UP
          </motion.button>

          <div className="mt-4 text-center">
            <span className="text-white/80">Already have an account?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="text-[#e94560] font-semibold hover:underline ml-1 cursor-pointer"
            >
              Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
