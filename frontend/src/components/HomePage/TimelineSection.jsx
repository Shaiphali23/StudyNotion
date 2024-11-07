import React from "react";
import Logo1 from "../../../src/assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../src/assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../src/assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../src/assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../assets/Images/TimelineImage.png";

const timeline = [
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];
const TimelineSection = () => {
  return (
    <div className="pb-24 pt-14 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-15 items-center">
        {/* Left Side: Timeline Descriptions */}
        <div className="w-full lg:w-[45%] flex flex-col gap-8">
          {timeline.map((element, index) => {
            return (
              <div className="flex gap-6" key={index}>
                <div className="w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full shadow-md">
                  <img src={element.Logo} alt={`${element.heading} Logo`}/>
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {element.heading}
                  </h2>
                  <p className="text-gray-600">{element.Description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Timeline Image with Info Box */}
        <div className="relative shadow-lg">
          <img src={timelineImage} alt="TimelineImage" />

          <div className="absolute bg-caribbeangreen-700 flex flex-col lg:flex-row text-white uppercase py-8 gap-5 left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7">
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">10</p>
              <p className="text-caribbeangreen-300 text-xs lg:text-sm">
                years experiences
              </p>
            </div>
            <div className="flex flex-row gap-5 items-center px-7">
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">250</p>
              <p className="text-caribbeangreen-300 text-xs lg:text-sm">
                types of courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
