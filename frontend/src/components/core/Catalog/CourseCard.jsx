import React, { useEffect, useState } from "react";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const CourseCard = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="mx-auto">
      <Link to={`/courses/${course._id}`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
          {/* Course Thumbnail */}
          <div>
            <img
              src={course?.thumbnail}
              alt="courseThumbnail"
              className={`${Height} w-full rounded-t-lg object-cover`}
            />
          </div>

          {/* Course Content */}
          <div className="p-4">
            <p className="text-lg font-semibold text-richblack-800 truncate">{course?.courseName}</p>
            <p className="text-richblack-600">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>

            {/* Rating Section */}
            <div className="flex items-center gap-x-3 mt-3">
              <span className="text-yellow-50 font-semibold">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-500">{course?.ratingAndReviews?.length} Ratings</span>
            </div>

            <p className="mt-2 text-xl font-bold text-richblack-900">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
