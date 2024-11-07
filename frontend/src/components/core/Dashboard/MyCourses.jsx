import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import { IoIosAdd } from "react-icons/io";
import CoursesTable from "./InstructorCourses/CoursesTable";

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <IconBtn
          text={"Add Course"}
          onClick={() => navigate("/dashboard/add-course")}
          customClasses="flex items-center bg-yellow-50 text-black px-4 py-2 rounded-md"
        >
          <IoIosAdd fontSize={20}/>
        </IconBtn>
      </div>

      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default MyCourses;
