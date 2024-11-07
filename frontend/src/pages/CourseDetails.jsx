import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../services/formatDate";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNumOfLec, setTotalNumOfLec] = useState(0);
  const [isActive, setIsActive] = useState({});

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        const data = result.data;
        if (typeof data.courseDetails.instructions === "string") {
          data.courseDetails.instructions = JSON.parse(
            (data.courseDetails.instructions = JSON.parse(
              data.courseDetails.instructions
            ))
          );
        }
        setCourseData(data);
      } catch (error) {
        console.log("Could not fetch course details.");
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
    courseData?.courseDetails?.courseContent.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNumOfLec(lectures);
  }, [courseData]);

  const handleActive = (id) => {
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

  if (loading || !courseData) {
    return <div>loading...</div>;
  }
  if (!courseData.success) {
    return (
      <div>
        <Error />
      </div>
    );
  }
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData?.courseDetails;

  return (
    <>
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
                <span className="text-sm text-richblack-400">{`(${ratingAndReviews.length} reviews)`}</span>
                <span className="text-sm text-richblack-400">{`(${studentsEnrolled.length} students enrolled)`}</span>
              </div>

              <p className="text-sm text-richblack-400">
                Created by {`${instructor.firstName}`}
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
              {courseContent.length} sections, {totalNumOfLec} lectures
            </div>

            <button
              onClick={() => setIsActive({})}
              className="text-blue-500 hover:underline text-sm"
            >
              Collapse all sections
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {courseContent?.map((section) => (
              <div
                key={section.id}
                className="p-4 bg-richblack-800 rounded-md cursor-pointer"
                onClick={() => handleActive(section.id)}
              >
                <p className="text-lg font-medium">{section.sectionName}</p>

                {isActive[section.id] && (
                  <div>
                    {section.subSection.map((lecture) => (
                      <p
                        key={lecture.id}
                        className="text-sm text-richblack-300"
                      >
                        {lecture.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Confirmation Modal */}
        {confirmationModal && (
          <ConfirmationModal modalData={confirmationModal} />
        )}
      </div>
    </>
  );
};

export default CourseDetails;
