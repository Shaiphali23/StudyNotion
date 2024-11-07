import React, { useState } from "react";
import Tab from "../../common/Tab";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSignUpData } from "../../../slices/authSlice";
import { sendOtp } from "../../../services/operations/authAPI";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const {
    email,
    password,
    confirmPassword,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  //data to pass to tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const signUpData = {
      ...formData,
      accountType,
    };
    dispatch(setSignUpData(signUpData));
    dispatch(sendOtp(email, navigate));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  return (
    <div>
      {/* Tab Component */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit}>
        <div className="flex flex-col gap-4">
          {/* First Name & Last Name*/}
          <div className="flex gap-x-4">
            <div className="w-full">
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
                <sup className="text-[#EF476F] gap-1">*</sup>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              />
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
                <sup className="text-[#EF476F] gap-1">*</sup>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              />
            </div>
          </div>

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
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium"
            >
              Phone Number
              <sup className="text-[#EF476F] gap-1">*</sup>
            </label>
            <input
              type="number"
              name="contactNumber"
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
          </div>

          {/* Create Password & Confirm Password*/}
          <div className="flex gap-x-4">
            <div className="w-full relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Create Password
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
            </div>
            <div className="w-full relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
                <sup className="text-[#EF476F] gap-1">*</sup>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="confirm password"
                required
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-md font-medium text-richblack-900 bg-[#FFD60A]"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
