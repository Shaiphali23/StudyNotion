import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import ReactStars from "react-stars";
import { ratingsEndpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncate = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const response = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      console.log("All ratings review data", response);
      setReviews(response.data.data);
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Swiper
        freeMode
        grabCursor
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="w-full max-w-5xl mx-auto"
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            {review && review.user.image ? (
              <div className="bg-richblack-800 p-6 text-center lg:text-left rounded-lg shadow-md">
                {/* User info with image */}
                <div className="flex flex-col lg:flex-row items-center mb-4">
                  <img
                    src={review.user.image}
                    className="w-12 h-12 rounded-full mr-2"
                  />
                  <div className="text-center lg:text-left">
                    <p className="font-semibold text-lg">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="text-richblack-300">{review.user.email}</p>
                  </div>
                </div>

                {/* Review text */}
                <p className="text-richblack-5 mt-2 text-sm lg:text-base text-center">
                  {review.review.length > truncate
                    ? `${review.review.slice(0, truncate)}...`
                    : review.review}
                </p>

                {/* Star rating */}
                <div className="flex lg:flex-row items-center justify-center gap-2">
                  <p className="text-yellow-50">{review.rating}</p>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={24}
                    edit={false}
                    color2={"#ffd700"}
                  />
                </div>
              </div>
            ) : (
              <p>Review not available</p>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
