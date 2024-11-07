import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleRight } from "react-icons/fa6";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // cancel editing a section
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // go back to the previous step
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  // proceed to the next step
  const goToNext = () => {
    console.log("Moving to the next steps");
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    dispatch(setStep(3));
  };

  // handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let result;
      if (editSectionName) {
        // Update existing section
        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course._id,
          },
          token
        );
      } else {
        // Create new section
        result = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course._id,
          },
          token
        );
      }
      if (result) {
        dispatch(setCourse(result));
        setEditSectionName(null);
        setValue("sectionName", "");
      }
    } catch (error) {
      console.error("Error creating/updating section:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle changes in editing section names
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="bg-richblack-800 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">Course Builder</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section name input field */}
        <div className="mb-4">
          <label
            htmlFor="sectionName"
            className="block text-sm font-medium mb-1 text-richblack-5"
          >
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            placeholder="Add Section Name"
            {...register("sectionName", { required: true })}
            className="w-full p-2 rounded-md border border-richblack-600 bg-richblack-700 text-white focus:outline-none"
          />
          {errors.sectionName && (
            <span className="text-[#FF0000] text-sm">
              Section name is required
            </span>
          )}
        </div>

        {/* create/edit/cancel button */}
        <div className="flex items-center justify-between mt-5">
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            customClasses="flex items-center bg-[#E7C009] text-richblack-900 px-4 py-2 rounded-md font-semibold gap-1"
          >
            <IoIosAddCircleOutline fontSize={20}/>
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Render NestedView if there are course contents */}
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Back and Next button */}
      <div className="flex justify-end gap-x-3 mt-5">
        <button onClick={goBack} className="flex items-center">
          Back
        </button>
        <IconBtn
          text={"Next"}
          onClick={goToNext}
          customClasses="flex items-center bg-[#E7C009] py-2 px-4 rounded text-richblack-900 font-bold"
        >
          <FaAngleRight />
        </IconBtn>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
