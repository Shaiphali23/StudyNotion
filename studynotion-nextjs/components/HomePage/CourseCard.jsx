import React from "react";
import { FaUserFriends } from "react-icons/fa";

const CourseCard = ({ element }) => {
  return (
    <div className="bg-richblack-800 shadow-lg p-6">
      <h3 className="font-semibold text-lg mb-3 text-white">
        {element.heading}
      </h3>
      <p className="text-richblack-300 mb-4">{element.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-400 font-inter">
        <p className="flex items-center gap-2">
          <FaUserFriends className="text-gray-500" /> {element.level}
        </p>
        <p className="text-sm text-gray-500">{element.lessonNumber} Lessons</p>
      </div>
    </div>
  );
};

export default CourseCard;
