import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../assets/Images/Plan_your_lessons.png";
import CTAButton from "./CTAButton";

const LearningLanguageSection = () => {
  return (
    <div className="sm:mt-12 sm:mb-7 lg:mt-24 lg:mb-14 px-4 lg:px-0">
      <div className="flex flex-col gap-8 items-center">
        {/* Heading */}
        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">
          Your swiss knife for <HighlightText text={"learning any language"} />
        </div>

        {/* Description */}
        <div className="text-center text-richblack-600 max-w-3xl text-sm lg:text-base">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* Images Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center mt-8">
          <img
            src={know_your_progress}
            className="object-contain -mr-32"
            alt="knowYourProgress"
          />
          <img
            src={compare_with_others}
            className="object-contain"
            alt="compareWithOthers"
          />
          <img
            src={plan_your_lessons}
            className="object-contain -ml-32"
            alt="planYourLessons"
          />
        </div>

        {/* CTA Button */}
        <div className="w-fit mx-auto">
          <CTAButton active={true} linkto={"/signup"}>
            <div>Learn More</div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
