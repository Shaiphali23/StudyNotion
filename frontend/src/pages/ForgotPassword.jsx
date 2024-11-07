import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="text-white flex justify-center items-center h-screen">
      {loading ? (
        <div className="text-xl font-semibold">Loading...</div>
      ) : (
        <div className="w-full max-w-md p-6 bg-richblack-800 rounded-md shadow-lg">
          <h1 className="text-2xl font-bold mb-4">
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h1>

          <p className="text-richblack-100 mb-6">
            {!emailSent
              ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>

          <form onSubmit={handleForgotPassword}>
            {!emailSent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                  <sup className="text-[#EF476F] ml-1">*</sup>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-richblack-900 w-full px-4 py-2 border-none outline-none rounded-md"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  value={email}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FFD60A] text-richblack-900 py-2 rounded-md"
            >
              {!setEmail ? "Reset Password" : "Resend email"}
            </button>

            <div className="mt-4">
              <Link
                to={"/login"}
                className="flex items-center gap-2 hover:underline"
              >
                <BiLeftArrowAlt />
                <p>Back to login</p>
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
