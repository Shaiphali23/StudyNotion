"use client";

import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { resetPassword } from "@/services/operations/authAPI";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function UpdatePasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: resetToken } = use(params);
  const { loading } = useSelector((state: any) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const dispatch: any = useDispatch();
  const router = useRouter();
  // Services expect a navigate(path) callback; wrap router.push.
  const navigate = (path: string) => router.push(path);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { password, confirmPassword } = formData;

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }
  function toggleConfirmPasswordVisibility() {
    setConfirmPassword(!showConfirmPassword);
  }
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(resetPassword(password, confirmPassword, resetToken, navigate));
  };

  return (
    <>
      <Navbar />
      <div className="text-white flex justify-center items-center h-screen">
        {loading ? (
          <div className="text-xl font-semibold">Loading...</div>
        ) : (
          <div className="w-full max-w-md p-6 bg-richblack-800 rounded-md shadow-lg">
            <div>
              <h1 className="text-2xl font-bold mb-4">Choose new password</h1>
              <p className="text-richblack-100 mb-6">
                Almost done. Enter your new password and your all set.
              </p>
            </div>

            <form onSubmit={handleOnSubmit}>
              {/* create new password */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New password
                  <sup className="text-[#EF476F] ml-1">*</sup>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-md bg-richblack-900 outline-none border-none"
                  required
                  placeholder="Enter new password"
                  value={password}
                  name="password"
                  onChange={handleOnChange}
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-10 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* confirm new password */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm new password
                  <sup className="text-[#EF476F] ml-1">*</sup>
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-md bg-richblack-900 outline-none border-none"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-10 cursor-pointer"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD60A] text-richblack-900 py-2 rounded-md"
              >
                Reset Password
              </button>

              <div className="mt-4">
                <Link
                  href={"/login"}
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
      <Footer />
    </>
  );
}
