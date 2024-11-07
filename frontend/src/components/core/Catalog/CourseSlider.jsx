import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import CourseCard from "./CourseCard";

const CourseSlider = ({ Courses }) => {
  return (
    <div className="relative">
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          modules={[FreeMode, Pagination]}
        >
          {Courses.map((course, index) => (
            <SwiperSlide
              key={index}
              className="p-4 transition-transform transform hover:scale-105"
            >
              <CourseCard course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-richblack-400">No course found.</p>
      )}
    </div>
  );
};

export default CourseSlider;
