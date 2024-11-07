import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await getUserEnrolledCourses(token);
        setEnrolledCourses(response);
      } catch (error) {
        console.log("Unable to Fetch Enrolled Courses");
      }
    };
    if (token) {
      getEnrolledCourses();
    }
  }, [token]);

  return (
    <div className="text-white px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
      {!enrolledCourses.length ? (
        <p className="text-richblack-400">
          {enrolledCourses
            ? "Loading..."
            : "You have not enrolled in any course yet"}
        </p>
      ) : (
        <div className="hidden lg:grid grid-cols-3 gap-4 text-center mb-4">
          <p className="font-semibold">Course Name</p>
          <p className="font-semibold">Duration</p>
          <p className="font-semibold">Progress</p>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {enrolledCourses.map((course) => {
          const courseId = course?._id || "";
          const sectionId = course?.courseContent?.[0]?._id || "";
          const subSectionId =
            course?.courseContent?.[0]?.subSection?.[0]?._id || "";
          return (
            <div
              key={courseId}
              className="w-full flex flex-col lg:flex-row items-center gap-4 bg-richblack-800 p-4 rounded-lg shadow-md"
            >
              <div
                className="w-full lg:w-1/3 flex flex-col lg:flex-row items-center gap-4 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
                  )
                }
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="text-center lg:text-left">
                  <p className="text-lg font-semibold">{course.courseName}</p>
                  <p className="text-sm text-richblack-400">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-1/3 text-richblack-300 text-center">
                {course?.totalDuration || "N/A"}
              </div>

              <div className="w-full lg:w-1/3">
                <p className="text-sm text-richblack-300 mb-1">
                  Progress:{" "}
                  <span className="font-semibold">
                    {course.progressPercentage || 0}%
                  </span>
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  bgColor="#4F46E5"
                  isLabelVisible={false}
                  className="rounded-full overflow-hidden"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolledCourses;
