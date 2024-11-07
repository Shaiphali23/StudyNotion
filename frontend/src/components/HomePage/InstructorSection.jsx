import React from "react";
import Instructor from "../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className="mt-20 px-4 lg:px-0">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Instructor Image */}
        <div className="w-full lg:w-[1/2]">
          <img
            src={Instructor}
            alt="instructor"
            className="object-contain shadow-[-20px_-20px_0px_0px_#FFFFFF]"
          />
        </div>

        {/* Instructor Text Content */}
        <div className="w-full lg:w-[1/2] flex flex-col gap-6 lg:gap-10">
          <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold lg:w-[50%]">
            Become an <HighlightText text={"instructor"} />
          </div>

          <p className="font-medium text-[16px] w-[80%] text-richblack-300 max-w-lg">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className="flex items-start">
            <CTAButton active={true}>
              <div className="flex flex-row items-center gap-2">
                Start Teaching Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
