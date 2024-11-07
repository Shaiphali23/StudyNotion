import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    };
    populateCourseDetails();
  }, [courseId, token, dispatch]);

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold text-yellow-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      <div className="w-[700px] mx-auto">
        {course ? <RenderSteps /> : <p>Course not found</p>}
      </div>
    </div>
  );
};

export default EditCourse;
