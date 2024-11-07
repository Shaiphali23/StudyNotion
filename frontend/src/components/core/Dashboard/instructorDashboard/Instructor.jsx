import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

const Instructor = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);

      const instructorApiData = await getInstructorData(token);
      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }
      console.log("Updated instructorApiData:", instructorApiData);

      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    getCourseDataWithStats();
  }, [token]);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Hi, {user.firstName}</h1>
        <p className="text-richblack-400">Let's start something new.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-lg">Loading...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-6">
          <div>
            <InstructorChart courses={instructorData} />
            <div className="mt-8 bg-richblack-800 p-4 rounded-lg shadow">
              <p className="text-xl font-semibold mb-4">Statistics</p>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-richblack-700 p-4 rounded-lg text-center">
                  <p className="text-sm">Total Courses</p>
                  <p className="text-2xl font-semibold">{courses.length}</p>
                </div>

                <div className="bg-richblack-700 p-4 rounded-lg text-center">
                  <p className="text-sm">Total Students</p>
                  <p className="text-2xl font-semibold">{totalStudents}</p>
                </div>

                <div className="bg-richblack-700 p-4 rounded-lg text-center">
                  <p className="text-sm">Total Income</p>
                  <p className="text-2xl font-semibold">{totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Render 3 courses */}
          <div className="bg-richblack-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold">Your Courses</p>
              <Link to={"/dashboard/my-courses"}>
                <p className="text-blue-500 hover:underline">View all</p>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course, index) => (
                <div
                  key={index}
                  className="bg-richblack-700 p-4 rounded-lg shadow"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <p className="text-lg font-medium">{course.courseName}</p>
                  <div className="flex gap-2 items-center mt-2">
                    <p className="text-sm text-richblack-400">
                      {course.studentsEnrolled.length}
                    </p>
                    <p className="text-sm text-richblack-400">|</p>
                    <p className="text-sm text-richblack-400">
                      Rs. {course.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>You have not created any courses yet.</p>
          <Link to="/dashboard/add-course">Create a Course</Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
