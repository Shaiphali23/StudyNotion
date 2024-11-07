import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    if(success) setReviewModal(false);
  };

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-black w-[90%] max-w-lg bg-white rounded-lg shadow-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <p className="text-xl font-semibold">Add Review</p>
          <button onClick={() => setReviewModal(false)}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={user?.image}
              alt={user?.firstName}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-richblack-500 text-sm">Posting Publicly</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            {/* Rating Stars */}
            <div className="mb-4">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={30}
                activeColor="#ffd700"
                value={0}
              />
            </div>

            {/* Review Text Area */}
            <div className="mb-6 w-full">
              <label
                htmlFor="courseExperience"
                className="block text-sm font-medium text-richblack-700 mb-2"
              >
                Add Your Experience
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add your experience here..."
                {...register("courseExperience", { required: true })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none"
              />
              {errors.courseExperience && (
                <span className="text-sm text-[#FF0000]">
                  Please add your experience
                </span>
              )}
            </div>

            {/* Cancel/Save button */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setReviewModal(false)}
                className="px-4 py-2 bg-richblack-100 rounded-md hover:bg-richblack-200"
              >
                Cancel
              </button>
              <IconBtn
                text={"Save"}
                type="submit"
                customClasses="px-4 py-2 bg-yellow-50 rounded-md hover:bg-yellow-100"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
