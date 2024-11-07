import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import RequirementField from "./RequirementField";
import IconBtn from "../../../../common/IconBtn";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { setStep, setCourse } from "../../../../../slices/courseSlice";
import { MdNavigateNext } from "react-icons/md";
import ChipInput from "./ChipInput";
import Upload from "../Upload";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    //fetch all categories
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    // Compare current form values with existing course values
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags !== course.tag ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    } else {
      return false;
    }
  };

  // handle next button click
  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory._id);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
        setLoading(false);
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    //if creating a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);
    formData.append("status", COURSE_STATUS.DRAFT);

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border border-richblack-700 bg-richblack-800 p-6 space-y-8"
    >
      {/* Course Title */}
      <div className="flex flex-col">
        <label
          htmlFor="courseTitle"
          className="text-sm text-richblack-5 mb-2"
        >
          Course Title <sup className="text-pink-600">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter course title"
          {...register("courseTitle", { required: true })}
          className="p-2 bg-richblack-700 text-white rounded-md focus:outline-none"
        />
        {errors.courseTitle && (
          <span className="text-[#ef4444] text-sm mt-1">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col">
        <label
          htmlFor="courseShortDesc"
          className="text-sm text-richblack-5 mb-2"
        >
          Course Short Description <sup className="text-pink-600">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter short description"
          {...register("courseShortDesc", { required: true })}
          className="p-2 bg-richblack-700 text-white rounded-md focus:outline-none"
        />
        {errors.courseShortDesc && (
          <span className="text-[#ef4444] text-sm mt-1">
            Course description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="relative flex flex-col">
        <label
          htmlFor="coursePrice"
          className="text-sm text-richblack-5 mb-2"
        >
          Price <sup className="text-pink-600">*</sup>
        </label>
        <HiOutlineCurrencyRupee className="absolute left-2 top-[50px] transform -translate-y-1/2 text-richblack-400" />
        <input
          type="number"
          id="coursePrice"
          placeholder="Enter course price"
          {...register("coursePrice", { required: true, valueAsNumber: true })}
          className="p-2 pl-8 pr-10 bg-richblack-700 text-white rounded-md focus:outline-none"
        />
        {errors.coursePrice && (
          <span className="text-[#ef4444] text-sm mt-1">
            Course price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col">
        <label
          htmlFor="courseCategory"
          className="text-sm text-richblack-5 mb-2"
        >
          Course Category <sup className="text-pink-600">*</sup>
        </label>
        <select
          id="courseCategory"
          defaultValue={""}
          {...register("courseCategory", { required: true })}
          className="p-2 bg-richblack-700 text-white rounded-md focus:outline-none"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategories && (
          <span className="text-[#ef4444] text-sm mt-1">
            Course Category is required
          </span>
        )}
      </div>

      {/* course tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter tags and press enter"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      {/* course thumbnail Image*/}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Course Benefits */}
      <div className="flex flex-col">
        <label
          htmlFor="courseBenefits"
          className="text-sm text-richblack-5 mb-2"
        >
          Benefits of the Course<sup className="text-pink-600">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter Benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="p-2 bg-richblack-700 text-white rounded-md focus:outline-none"
        />
        {errors.courseBenefits && (
          <span className="text-[#ef4444] text-sm mt-1">
            Benefits of the course are required
          </span>
        )}
      </div>

      {/* Requirement Field Component */}
      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* next button / save changes button*/}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Without Saving
          </button>
        )}

        <IconBtn
          type="submit"
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
          customClasses="flex items-center gap-x-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-5 rounded-md transition-all"
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
};

export default CourseInformationForm;