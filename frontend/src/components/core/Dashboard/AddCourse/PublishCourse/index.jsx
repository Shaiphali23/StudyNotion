import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [course?.status, setValue]);

  const goBack = () => {
    dispatch(setStep(2));
  };
  const goToCourses = () => {
    // dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };
  const handleCoursePublish = async () => {
    //if form not updated
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCourses();
      return;
    }

    //if form updated
    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const onSubmit = () => {
    handleCoursePublish();
  };

  return (
    <div className="rounded-md bg-richblack-800 p-6 border-[1px] border-richblack-700">
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 rounded"
            />
            <span className="ml-2">Make this course as public</span>
          </label>
        </div>

        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="flex items-center rounded-md bg-richblack-300 px-4 py-2"
          >
            Back
          </button>

          <IconBtn
            text={"Save Changes"}
            disabled={loading}
            type="submit"
            customClasses="px-4 py-2 bg-yellow-50 rounded-md text-black font-bold"
          />
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
