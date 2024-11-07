import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross1 } from "react-icons/rx";
import Upload from "../../AddCourse/Upload";
import IconBtn from "../../../../common/IconBtn";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    );
  };

  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", currentValues.lectureVideo);
    }

    setLoading(true);
    try {
      const result = await updateSubSection(formData, token);
      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData.sectionId ? result : section
        );

        const updatedCourse = {
          ...course,
          courseContent: updatedCourseContent,
        };
        dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
    } catch (error) {
      console.error("Error updating subsection:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        await handleEditSubSection();
      }
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("videoFile", data.lectureVideo);

    //API Call for creating subSection
    const result = await createSubSection(formData, token);
    setLoading(true);
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 text-richblack-900">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">{add ? "Adding" : edit ? "Editing" : "Viewing"} Lecture</p>

          <button onClick={() => setModalData(null)} className="text-richblack-600 hover:text-richblack-900">
            <RxCross1 size={20}/>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
            video={true}
            editData={edit || view ? modalData.videoUrl : null}
          />

          {/* lecture title */}
          <div className="mb-4">
            <label htmlFor="lectureTitle" className="block text-sm font-medium mb-1">Lecture Title</label>
            <input
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full border rounded-md p-2"
            />
            {errors.lectureTitle && <span>Lecture title is required</span>}
          </div>

          {/* lecture description */}
          <div className="mb-4">
            <label htmlFor="lectureDesc" className="block text-sm font-medium mb-1">Lecture Description</label>
            <input
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="w-full border rounded-md p-2"
            />
            {errors.lectureDesc && <span>Lecture description is required</span>}
          </div>

          {/* cancel/save button */}
          {!view && (
            <div className="flex gap-x-3">
              <button
                onClick={() => setModalData(null)}
                className="px-4 py-2 text-sm rounded-md bg-richblack-200 hover:bg-richblack-300"
              >
                Cancel
              </button>

              <IconBtn
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                type="submit"
                customClasses="px-4 py-2 bg-[#E7C009] rounded-md"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;
