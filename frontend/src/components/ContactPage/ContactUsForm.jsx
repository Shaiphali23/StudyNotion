import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../data/countrycode.json";
import { apiConnector } from "../../services/apiConnector";
import { contactUsEndpoint } from "../../services/apis";
import toast from "react-hot-toast";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        contactUsEndpoint.CONTACT_US_API,
        data
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* firstName & lastName */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter last name"
            {...register("lastName")}
            className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
          />
          {errors.lastName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter last name
            </span>
          )}
        </div>
      </div>

      {/* email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          {...register("email", { required: true })}
          className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your email address.
          </span>
        )}
      </div>

      {/* Phone number input with country code select */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber" className="block text-sm font-medium">
          Phone Number
        </label>

        <div className="flex gap-5">
          {/* Country Code Select */}
          <div className="flex flex-col gap-2">
            <select
              name="countryCode"
              id="countryCode"
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              {...register("countryCode", { required: true })}
            >
              {CountryCode.map((ele, i) => {
                return (
                  <option key={i} value={ele.code}>
                    {ele.code} - {ele.country}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Phone Number Input */}
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="1234567890"
              className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              {...register("phoneNumber", {
                required: {
                  value: true,
                  message: "Please enter your phone number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
            {errors.phoneNumber && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="mt-1 block w-full px-4 py-2 rounded-md outline-none border-none bg-richblack-800"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
