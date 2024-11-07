import React from "react";
import { useSelector } from "react-redux";
import frameImg from "../../../assets/Images/frame.png";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const Template = ({ title, description1, description2, image, formType }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <div className="text-xl font-semibold">Loading...</div>
      ) : (
        <div className="mx-auto w-11/12 max-w-7xl flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-20 text-white">
          {/* Text Section */}
          <div className="space-y-6 max-w-xl my-5">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{title}</h1>
            <div className="text-sm md:text-md">
              <span>{description1}</span>
              <span className="text-[#47A5C5] italic">{description2}</span>
            </div>

            {/* Conditional form */}
            {formType === "signup" ? <SignUpForm /> : <LoginForm />}
          </div>

          {/* Image Section */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            <img
              src={frameImg}
              alt="Pattern"
              className="w-[80%] sm:w-[70%] lg:w-[540px]"
              // height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={540}
              // height={504}
              loading="lazy"
              className="absolute bottom-4 right-4 w-[80%] sm:w-[70%] lg:w-[540px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Template;
