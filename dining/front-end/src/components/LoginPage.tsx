import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast} from "sonner";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showResetForm, setShowResetForm] = useState(false);
  const [inputs, setInputs] = useState({ email: "", password: "" });

  useEffect(() => {
    const labels = document.querySelectorAll(
      ".floating-label"
    ) as NodeListOf<HTMLLabelElement>;
    labels.forEach((label) => {
      label.innerHTML = label.innerText
        .split("")
        .map(
          (letter, idx) =>
            `<span class="inline-block transition-transform duration-500 ease-in-out" style="transition-delay:${
              idx * 50
            }ms">${letter}</span>`
        )
        .join("");
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("/api/user/signin", inputs)
      .then((res) => {
        console.log(res.data);
        navigate(`/${res.data.user._id}/dashboard`);
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.response.data.error);
      });
  };

  const handleResetSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Reset link sent to:", inputs.email);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowResetForm(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40 w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-white mb-8 drop-shadow-xl">
          {showResetForm ? "Reset Password 🔐" : "Welcome Back 🍽️"}
        </h1>

        {showResetForm ? (
          <form onSubmit={handleResetSubmit}>
            <div className="relative mb-6 w-full group">
              <input
                type="email"
                required
                value={inputs.email}
                onChange={handleChange}
                name="email"
                className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
                placeholder="Email"
              />
              <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
                Email
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-400 text-white font-semibold py-2 rounded-md hover:bg-orange-500 transition"
            >
              Send Reset Link
            </button>
            <p className="text-sm text-center text-white mt-4">
              Remembered?{" "}
              <button
                type="button"
                className="text-orange-200 underline"
                onClick={() => setShowResetForm(false)}
              >
                Back to Login
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <div className="relative mb-8 w-full group">
              <input
                type="text"
                name="email"
                value={inputs.email}
                required
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
                placeholder="Email"
              />
              <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
                Email
              </label>
            </div>

            <div className="relative mb-4 w-full group">
              <input
                type="password"
                name="password"
                value={inputs.password}
                required
                className="w-full bg-transparent border-0 border-b-2 border-white/70 text-white text-lg py-2 focus:outline-none focus:border-orange-400 peer placeholder-transparent"
                onChange={handleChange}
                placeholder="Password"
              />
              <label className="floating-label absolute top-2 left-0 pointer-events-none text-white/80 text-lg peer-focus:text-orange-300 peer-valid:text-orange-300">
                Password
              </label>
            </div>

            <div className="mb-6 text-right">
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm text-orange-200 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-400 text-white font-semibold py-2 rounded-md hover:bg-orange-500 transition"
            >
              Login
            </button>
            <p className="text-white/90 text-sm text-center mt-6">
              Don't have an account?{" "}
              <a href="/register" className="text-orange-200 underline">
                Register
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
