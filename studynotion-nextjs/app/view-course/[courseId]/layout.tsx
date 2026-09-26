"use client";

import { use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getFullDetailsOfCourse } from "@/services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "@/slices/viewCourseSlice";
import VideoDetailsSidebar from "@/components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "@/components/core/ViewCourse/CourseReviewModal";

export default function ViewCourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [reviewModal, setReviewModal] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const dispatch: any = useDispatch();
  const router = useRouter();

  // PrivateRoute behaviour: unauthenticated users go to login
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        const courseData = await getFullDetailsOfCourse(courseId, token);
        if (!courseData?.courseDetails) {
          console.error("Error fetching course details: no data");
          return;
        }
        dispatch(
          setCourseSectionData(courseData.courseDetails.courseContent || [])
        );
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos || []));

        let lectures = 0;
        courseData?.courseDetails?.courseContent?.forEach((sec: any) => {
          lectures += sec?.subSection?.length || 0;
        });
        dispatch(setTotalNoOfLectures(lectures));
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    if (token) {
      setCourseSpecificDetails();
    }
  }, [courseId, token, dispatch]);

  return (
    <div className="flex flex-col md:flex-row text-white min-h-screen">
      <VideoDetailsSidebar setReviewModal={setReviewModal} />

      <div className="flex-grow flex flex-col items-center py-10 min-h-screen">
        <div className="w-full md:w-11/12">{children}</div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
}
