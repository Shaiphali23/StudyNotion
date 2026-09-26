"use client";
export const dynamic = "force-dynamic";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { buyCourse } from "@/services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "@/services/operations/courseDetailsAPI";
import GetAvgRating from "@/utils/avgRating";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import RatingStars from "@/components/common/RatingStars";
import CourseDetailsCard from "@/components/core/Course/CourseDetailsCard";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { formatDate } from "@/services/formatDate";

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { user } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth);
  const { loading } = useSelector((state: any) => state.profile);
  const dispatch: any = useDispatch();
  const router = useRouter();
  // Services expect a navigate(path) callback; wrap router.push.
  const navigate = (path: string) => router.push(path);

  const [courseData, setCourseData] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState<any>(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNumOfLec, setTotalNumOfLec] = useState(0);
  const [isActive, setIsActive] = useState<Record<string, boolean>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      setPageLoading(true);
      setFetchError(null);
      try {
        const result = await fetchCourseDetails(courseId);
        const data = result?.data;
        if (!data?.courseDetails) {
          console.log("Could not fetch course details.");
          setFetchError("Could not fetch course details.");
          return;
        }
        if (typeof data.courseDetails.instructions === "string") {
          try {
            data.courseDetails.instructions = JSON.parse(
              data.courseDetails.instructions
            );
          } catch {
            // keep original string if it isn't valid JSON
          }
        }
        setCourseData(data);
      } catch (error) {
        console.log("Could not fetch course details.", error);
        setFetchError("Could not fetch course details.");
      } finally {
        setPageLoading(false);
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(courseData?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [courseData]);

  useEffect(() => {
    let lectures = 0;
    courseData?.courseDetails?.courseContent?.forEach((sec: any) => {
      lectures += sec?.subSection?.length || 0;
    });
    setTotalNumOfLec(lectures);
  }, [courseData]);

  const handleActive = (id: string) => {
    setIsActive((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to purchase the course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (pageLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-richblack-500 border-t-yellow-50" />
            <p className="text-white">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (fetchError || !courseData?.courseDetails) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] justify-center items-center text-3xl text-white">
          {fetchError || "Error 404 not found"}
        </div>
        <Footer />
      </>
    );
  }
  if (!courseData.success) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center text-3xl text-white">
          Error 404 not found
        </div>
        <Footer />
      </>
    );
  }
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent = [],
    ratingAndReviews = [],
    instructor,
    studentsEnrolled = [],
    createdAt,
  } = courseData?.courseDetails;

  return (
    <>
      <Navbar />
      <div className="w-full bg-richblack-800 py-8 lg:py-10">
        {/* Hero Section */}
        <div className="mx-auto w-11/12 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center">
            <div className="md:w-full lg:w-2/4 space-y-4">
              <h1 className="text-2xl font-semibold text-white">
                {courseName}
              </h1>

              <p className="text-richblack-300">{courseDescription}</p>

              <div className="flex flex-col md:flex-row justify-start lg:items-center gap-2">
                <span className="font-semibold text-lg text-yellow-100">
                  {avgReviewCount}
                </span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                <span className="text-sm text-richblack-400">{`(${ratingAndReviews?.length || 0} reviews)`}</span>
                <span className="text-sm text-richblack-400">{`(${studentsEnrolled?.length || 0} students enrolled)`}</span>
              </div>

              <p className="text-sm text-richblack-400">
                Created by {`${instructor?.firstName || ""} ${instructor?.lastName || ""}`.trim() || "Instructor"}
              </p>

              <div className="text-sm text-richblack-400">
                <p>
                  Created At:{" "}
                  <span className="text-richblack-300">
                    {formatDate(createdAt)}
                  </span>
                </p>
                <p>
                  Language: <span className="text-richblack-300">English</span>
                </p>
              </div>
            </div>

            <CourseDetailsCard
              course={courseData?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-11/12 max-w-7xl py-8 text-white">
        {/* What You Will Learn */}
        <section className="mt-10 mb-8">
          <h2 className="text-lg font-bold mb-2">What You Will Learn</h2>
          <p>{whatYouWillLearn}</p>
        </section>

        {/* Course Content */}
        <section className="mb-8 w-full lg:w-3/6">
          <h2 className="text-lg font-bold mb-2">Course Content</h2>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-richblack-400">
              {courseContent?.length || 0} sections, {totalNumOfLec} lectures
            </div>

            <button
              onClick={() => setIsActive({})}
              className="text-blue-500 hover:underline text-sm"
            >
              Collapse all sections
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {courseContent?.map((section: any) => {
              const sectionKey = section._id || section.id;
              return (
              <div
                key={sectionKey}
                className="p-4 bg-richblack-800 rounded-md cursor-pointer"
                onClick={() => handleActive(sectionKey)}
              >
                <p className="text-lg font-medium">{section.sectionName}</p>

                {isActive[sectionKey] && (
                  <div>
                    {section.subSection?.map((lecture: any) => (
                      <p
                        key={lecture._id || lecture.id}
                        className="text-sm text-richblack-300"
                      >
                        {lecture.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </section>

        {/* Confirmation Modal */}
        {confirmationModal && (
          <ConfirmationModal modalData={confirmationModal} />
        )}
      </div>
      <Footer />
    </>
  );
}
