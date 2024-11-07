import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { FaStar } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="space-y-8">
      {cart.map((course, i) => (
        <div
          key={course._id}
          className="flex flex-wrap items-start justify-between gap-6 p-4 bg-richblack-800 rounded-lg"
        >
          {/* Course Thumbnail and Details */}
          <div className="flex flex-1 flex-col gap-4">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="w-48 h-32 rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-semibold text-richblack-100">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-semibold">4.8</span>
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  value={course?.ratingAndReviews?.length}
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-richblack-400 text-sm">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>

          {/* Remove Button and Price */}
          <div className="flex flex-col items-end space-y-2">
            <button onClick={() => dispatch(removeFromCart(course._id))} className="flex items-center gap-1 font-medium rounded-lg text-[#D11A2A]">
              <RiDeleteBinLine className="text-lg"  />
              <span>Remove</span>
            </button>
            <p className="text-2xl font-bold text-yellow-300">Rs. {course?.price} </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
