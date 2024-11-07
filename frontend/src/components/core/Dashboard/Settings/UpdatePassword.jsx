import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/settingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States for password visibility toggling
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const submitPasswordForm = async (data) => {
    try {
      dispatch(changePassword(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 text-richblack-5">
          <h2 className="text-lg font-semibold">Password</h2>

          {/* Email Field */}
          {/* <div className="relative flex flex-col gap-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-700"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              {...register("email", { required: true })} // Register field
            />
            {errors.email && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your Email.
              </span>
            )}
          </div> */}

          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Current Password Field
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium"
              >
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-700"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div> */}

            {/* Old Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium"
              >
                Current Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter current Password"
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-700"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your current Password.
                </span>
              )}
            </div>

            {/* New Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter new Password"
                className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-700"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                {...register("newPassword", { required: true })}
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[40px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your new Password.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cancel/Update button */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/dashboard/my-profile")}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn
            type="submit"
            text="Update"
            customClasses="bg-yellow-100 px-2 rounded-md text-richblack-900"
          />
        </div>
      </form>
    </>
  );
}
