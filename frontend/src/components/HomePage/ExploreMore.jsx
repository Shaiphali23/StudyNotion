import React, { useState } from "react";
import { HomePageExplore } from "../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const ExploreMore = () => {
  const tabsName = HomePageExplore.map((category) => category.tag);
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);

  const setMyCard = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
  };

  return (
    <div className="mx-auto mt-6 max-w-7xl px-4 md:px-8 flex flex-col">
      {/* Heading Section */}
      <div className="text-center">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
          Unlock the <HighlightText text={"Power of Code"} />
        </h2>
        <p className="text-sm md:text-base text-richblack-300">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* Tabs Section */}
      <div className="flex rounded-full bg-richblack-800 px-1 py-1 lg:mb-6 lg:mt-10 gap-4">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-base px-4 py-2 items-center rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-semibold"
                  : "text-richblack-200 hover:bg-richblack-900 hover:text-richblack-5"
              }`}
              key={index}
              onClick={() => setMyCard(element)}
            >
              {element}
            </div>
          );
        })}
      </div>

      {/* Courses Card Section */}
      <div className="flex lg:h-[150px] lg:mt-12 justify-center items-center">
        <div className="absolute grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((element, index) => {
            return <CourseCard key={index} element={element} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreMore;
