import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SelectCompany from "./SelectCompany";

const Login = () => {
  const { loading, isAuthenticated, signIn } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    axios
      .post("/api/user/signin", formData)
      .then((res) => {
        console.log(res);
        signIn(res.data.user);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || err.response.data.error);
      });
  };

  if (loggedIn) {
    return <SelectCompany />;
  }

  return (
    <div className="min-w-full relative h-[100vh] flex items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-xs z-10 border border-white/10"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Welcome
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Email
            </label>
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

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <motion.input
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent pr-10"
                placeholder="Enter your password"
                required
              />
              {/* Eye Icon */}
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white/70"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </span>
            </div>
          </div>

          <div className=" mb-2 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/password")}
              className="text-[#e94560] font-semibold hover:underline cursor-pointer"
            >
              Forgot Password?
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#e94560] text-white py-2 px-4 rounded-lg text-base font-bold hover:bg-[#d8344f] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 cursor-pointer"
          >
            LOGIN
          </motion.button>

          <div className="mt-4 text-center">
            <span className="text-white/80">Don't have an account?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="text-[#e94560] font-semibold hover:underline ml-1 cursor-pointer"
            >
              Sign Up
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
