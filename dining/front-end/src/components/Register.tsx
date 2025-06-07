import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const labels = document.querySelectorAll(
      ".floating-label"
    ) as NodeListOf<HTMLLabelElement>;
    labels.forEach((label) => {
      label.innerHTML = label.innerText
        .split("")
        .map(
          (letter, idx) =>
            `<span class='inline-block transition-transform duration-500 ease-in-out' style='transition-delay:${
              idx * 30
            }ms'>${letter}</span>`
        )
        .join("");
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registered Data:", form);
    axios
      .post("/api/user/signup", form)
      .then((res) => {
        console.log(res.data);
        toast.success("Registration successful! Please check your email for verification.");
      })
      .catch((err) => {
      toast.error(err.response.data.message || err.response.data.error);
      });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/40 w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-white mb-8 drop-shadow-xl">
          Create Your Account 🍽️
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-8 w-full group">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
              placeholder="First Name"
            />
            <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
              First Name
            </label>
          </div>

          <div className="relative mb-8 w-full group">
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
              placeholder="Last Name"
            />
            <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
              Last Name
            </label>
          </div>

          <div className="relative mb-8 w-full group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
              placeholder="Email"
            />
            <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
              Email
            </label>
          </div>

          <div className="relative mb-8 w-full group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
              placeholder="Password"
            />
            <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white font-semibold py-2 rounded-md hover:bg-orange-500 transition"
          >
            Register
          </button>

          <p className="text-white/90 text-sm text-center mt-6">
            Already have an account?{" "}
            <a href="/" className="text-orange-200 underline hover:text-orange-100">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
