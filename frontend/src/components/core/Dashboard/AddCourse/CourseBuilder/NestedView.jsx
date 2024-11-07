import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { GrView } from "react-icons/gr";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Delete Section handler
  const handleDeleteSection = async (sectionId) => {
    try {
      const result = await deleteSection({
        sectionId,
        courseId: course._id,
        token,
      });
      if (result) {
        dispatch(setCourse(result));
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      // Close the confirmation modal
      setConfirmationModal(null);
    }
  };

  // Delete Sub Section handler
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    try {
      const result = await deleteSubSection({ sectionId, subSectionId, token });

      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === sectionId ? result : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      } else {
        console.error("Failed to delete subsection: result is undefined");
      }
    } catch (error) {
      console.error("Error deleting subsection:", error);
    } finally {
      setConfirmationModal(null);
    }
  };

  return (
    <div>
      <div className="rounded-lg bg-richblack-700 p-6 mt-5 shadow-lg">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open className="mb-5">
            {/* Section */}
            <summary className="flex items-center justify-between gap-x-3 border-b-2 pb-2">
              {/* dropdown icon & sectionName */}
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu fontSize={20} />
                <p className="text-xl font-medium">{section.sectionName}</p>
              </div>

              <div className="flex items-center gap-x-3">
                {/* Edit section button */}
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                  className="text-[#E7C009]"
                >
                  <MdModeEditOutline />
                </button>

                {/* Delete section button */}
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this section",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="text-[#D11A2A]"
                >
                  <RiDeleteBinLine />
                </button>

                <span>|</span>

                {/* dropdown icon */}
                <button>
                  <IoMdArrowDropdown className="text-lg text-richblack-300" />
                </button>
              </div>
            </summary>

            {/* Sub Section */}
            <div className="pl-2">
              {section.subSection.map((data) => (
                <div
                  key={data._id}
                  className="flex justify-between items-center gap-x-3 border-b-2 py-2"
                >
                  {/* dropdown icon & subSectionName */}
                  <div
                    onClick={() => setViewSubSection(data)}
                    className="flex items-center gap-x-3"
                  >
                    <RxDropdownMenu />
                    <p>{data.title}</p>
                  </div>

                  <div className="flex items-center gap-x-3">
                    {/* edit subSection */}
                    <button
                      onClick={() => {
                        setEditSubSection({ ...data, sectionId: section._id });
                      }}
                      className="text-[#E7C009]"
                    >
                      {" "}
                      <MdModeEditOutline />
                    </button>

                    {/* View Subsection Button */}
                    <button
                      onClick={() => {
                        setViewSubSection(data);
                      }}
                    >
                      <GrView />
                    </button>

                    {/* delete sub section */}
                    <div>
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this sub section",
                            text2: "Selected lecture will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(data._id, section._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className="text-[#D11A2A]"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* (+) add subsection */}
            <button
              onClick={() => setAddSubSection(section._id)}
              className="mt-4 flex items-center gap-x-2 text-yellow-50 hover:text-yellow-100"
            >
              <FaPlus />
              <p>Add Lecture</p>
            </button>
          </details>
        ))}
      </div>

      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      )}

      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      )}

      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default NestedView;
