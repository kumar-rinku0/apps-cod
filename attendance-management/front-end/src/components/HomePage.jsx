import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/5041145.jpg";
import bloggerImage from "../assets/bloger.jpg";

import { Link } from "react-router";
import { FaUsers, FaCogs, FaCheckCircle, FaMoneyBillAlt, FaMobileAlt, FaFingerprint, FaCalendarAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import axios from "axios";

import Image1 from "../assets/1.jpg";
import Image2 from "../assets/2.jpg";
import Image3 from "../assets/3.jpg";
import Image4 from "../assets/4.jpg";
import Image5 from "../assets/5.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const ContactFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    companyCode: "",
    comments: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/contact/create", formData);
      console.log(res);
      setFormData({
        name: "",
        mobile: "",
        companyCode: "",
        comments: "",
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleUp}
        className="bg-white p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
        {isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Form submitted successfully.</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Code</label>
            <input
              type="text"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 cursor-pointer disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#00796b] text-white px-4 py-2 rounded-md hover:bg-[#004d40] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
const HomePage = ({ btn, btnRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const companies = [
    { name: "Kolors", src: Image1 },
    { name: "ISWHC", src: Image2 },
    { name: "Broomees", src: Image3 },
    { name: "TravClan", src: Image4 },
    { name: "VehicleCare", src: Image5 }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 sm:p-8">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-8 py-12 mb-16"
      >
        {/* Text Content */}
        <div className="w-full sm:w-1/2 flex flex-col gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-5xl font-bold text-[#e94560]">Attendance</span>
            <span className="text-5xl font-bold text-[#4dd0e1] mt-2 sm:mt-0">Management</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mt-4 text-white">
            Simplify Staff <br /> Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-8 mt-4">
            Meet the smartest staff management system to manage attendance,
            payroll, compliances, and much more.
          </p>
          <Link
            to={btnRef}
            className="w-full flex justify-center sm:justify-start mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#e94560] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#d8344f] transition duration-300 w-full sm:w-auto cursor-pointer"
            >
              {btn}
            </motion.button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <motion.img
            src={logo}
            alt="attendance img"
            className="w-full max-w-lg h-auto object-contain rounded-lg shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Industries Section */}
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-30 mt-20 text-white">Loved by companies across various industries</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-16 px-4">
          {companies.map((company, index) => (
            <img
              key={index}
              src={company.src}
              alt={company.name}
              className="h-40 w-40 object-contain mb-8 sm:mb-32"
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full bg-[#1a1a2e] py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-white">Enabling Easier Staff Management</h1>
          <p className="text-xl text-gray-300 mb-12">
            SalaryBox is built for businesses to provide an exceptional experience and scale employee management.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaUsers className="text-4xl text-[#e94560]" />, title: "Manage", description: "Efficiently manage your staff." },
              { icon: <FaCogs className="text-4xl text-[#e94560]" />, title: "Process", description: "Streamline your processes." },
              { icon: <FaCheckCircle className="text-4xl text-[#e94560]" />, title: "Verify", description: "Ensure accuracy in records." },
              { icon: <FaMoneyBillAlt className="text-4xl text-[#e94560]" />, title: "Pay", description: "Handle payroll seamlessly." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#16213e] p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.icon}
                <h2 className="text-2xl font-semibold mt-4 text-white">{feature.title}</h2>
                <p className="text-lg text-gray-300 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Solutions Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <FaMobileAlt className="text-4xl text-[#e94560]" />, title: "Mobile Attendance", description: "Gain real-time visibility of employee attendance." },
            { icon: <FaFingerprint className="text-4xl text-[#e94560]" />, title: "Biometric Attendance", description: "Integrate biometrics for seamless attendance management." },
            { icon: <FaCalendarAlt className="text-4xl text-[#e94560]" />, title: "Roster Management", description: "Create and manage employee schedules with ease." },
          ].map((solution, index) => (
            <motion.div
              key={index}
              className="bg-[#16213e] p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {solution.icon}
              <h2 className="text-2xl font-semibold mt-4 text-white">{solution.title}</h2>
              <p className="text-lg text-gray-300 mt-2 text-center">{solution.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 bg-[#e94560] text-white py-2 px-6 rounded-lg text-lg hover:bg-[#d8344f] transition duration-300 cursor-pointer"
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full bg-[#1a1a2e] py-16 mb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-12">
          {/* Image */}
          <div className="w-full sm:w-1/2">
            <motion.img
              src={bloggerImage}
              alt="blogger img"
              className="w-full h-auto object-contain rounded-xl shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="w-full sm:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-white">Spend Less Time and Manage Your Employees Smartly</h1>
            <ul className="list-none p-0 space-y-6">
              {[
                { title: "Easy to Use", description: "SalaryBox is easy to use, with a simple and intuitive interface that makes navigating and handling its features effortless." },
                { title: "Safe and Secured", description: "With top-notch security and advanced encryption, our app ensures your data is protected and your privacy is respected." },
                { title: "100% Data Backup", description: "Rest easy with 100% data backup, ensuring all your employee management information is automatically updated on the cloud." },
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[#e94560] text-2xl mr-4">✔️</span>
                  <div>
                    <strong className="text-xl text-white">{benefit.title}</strong>
                    <p className="text-lg text-gray-300 mt-2">{benefit.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Link to="/" className="text-[#e94560] font-semibold hover:underline mt-4 cursor-pointer">
              Create Account →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleUp}
        className="w-[90%] rounded-4xl bg-gradient-to-r from-[#e94560] to-[#4dd0e1] py-20 mb-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white text-lg mb-8">
            Switch to attendance for effortless staff management.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-900 transition duration-300 cursor-pointer"
            onClick={openModal}
          >
            Connect With Us
          </motion.button>
        </div>
      </motion.div>

      <footer className="w-full bg-[#0b1727] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#00c9ff]">About Us</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Store</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Careers</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Support</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Contact Us</a></li>
              </ul>
            </div>

            {/* Calculator Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Calculator</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#00c9ff]">Salary Calculator</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">HRA Calculator</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Gratuity Calculator</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">PPF Calculator</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">SIP Calculator</a></li>
              </ul>
            </div>

            {/* Tools Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#00c9ff]">Poster Maker</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Search Jobs</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Certificate Maker</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Compliance Calendar</a></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#00c9ff]">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00c9ff]">Refund/Cancellations</a></li>
              </ul>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="mt-10 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              {/* <Image src="/logo.png" alt="SalaryBox Logo" width={160} height={40} /> */}
              {/* <p className="mt-2 text-gray-400">Get end-to-end visibility of your employees with top-notch staff management software.</p> */}
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-[#00c9ff]"><FaFacebookF /></a>
              <a href="#" className="text-gray-300 hover:text-[#00c9ff]"><FaInstagram /></a>
              <a href="#" className="text-gray-300 hover:text-[#00c9ff]"><FaLinkedinIn /></a>
              <a href="#" className="text-gray-300 hover:text-[#00c9ff]"><FaYoutube /></a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8 text-center text-gray-400">
            <p>+91 8107108740 | 8bitsjpr@gmail.com</p>
            <p>8Bit System Pvt Ltd Jaipur 302003</p>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-gray-500">
            © 2025 by 8Bit System Private Limited. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={closeModal} />

    </div>

  );
};

export default HomePage;