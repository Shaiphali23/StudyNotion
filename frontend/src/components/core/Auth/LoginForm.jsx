import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
              <sup className="text-[#EF476F] gap-1">*</sup>
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={FormData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
          </div>

          {/* Password */}
          <div className="w-full relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
              <sup className="text-[#EF476F] gap-1">*</sup>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            <Link to={"/forgot-password"}>
              <p className="absolute mt-1 right-0 text-xs text-blue-100">
                Forgot Password
              </p>
            </Link>
          </div>

          <button
            type="submit"
            className="mt-5 w-full py-3 rounded-md font-medium text-richblack-900 bg-[#FFD60A]"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
