import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        const courseData = await getFullDetailsOfCourse(courseId, token);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));

        let lectures = 0;
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length;
        });
        dispatch(setTotalNoOfLectures(lectures));
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    setCourseSpecificDetails();
  }, [courseId, token]);

  return (
    <div className="flex flex-col md:flex-row text-white min-h-screen">
      <VideoDetailsSidebar setReviewModal={setReviewModal} />

      <div className="flex-grow flex flex-col items-center py-10 min-h-screen">
        <div className="w-full md:w-11/12">
          <Outlet />
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
};

export default ViewCourse;
