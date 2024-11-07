import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor, you can't buy a course");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged In",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div className="bg-richblack-700 p-3 lg:p-6 rounded-lg shadow-md w-full lg:w-1/3 mt-10 lg:mt-0">
      {/* Course Image */}
      <img
        src={course?.thumbnail}
        alt="ThumbnailImage"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Price */}
      <div className="text-2xl font-bold text-yellow-50">
        Rs. {course.price}
      </div>

      {/* Buy and Add to Cart Buttons */}
      <div className="flex flex-col space-y-4 mt-4">
        <button
          className="w-full py-2 bg-yellow-50 hover:bg-yellow-100 transition text-black font-semibold rounded-md"
          onClick={
            user && course?.studentsEnrolled.includes(user?.id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && course?.studentsEnrolled.includes(user?.id)
            ? "Go to Courses"
            : "Buy Now"}
        </button>

        {/* TODO */}
        {!course?.studentsEnrolled.includes(user?.id) && (
          <button
            className="bg-yellow-50 hover:bg-yellow-100 transition w-full py-2 text-black font-semibold rounded-md"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Course Guarantee and Features */}
      <div className="space-y-2 text-sm mt-4">
        <p className="text-richblack-300">30-Day Money-Back Guarantee</p>
        <p className="font-semibold text-lg text-white">
          This Course Includes:
        </p>
        <div className="flex flex-col space-y-2">
          {course?.instructions?.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-richblack-300"
            >
              <span>{item}</span>
            </li>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="flex justify-center text-white mt-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-yellow-50 transition"
        >
          <IoMdShareAlt className="text-xl" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
