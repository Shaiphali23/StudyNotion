import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { IoIosArrowDown } from "react-icons/io";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;

      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );

      const currentSubSectionIndex = courseSectionData[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);

      //set current section
      setActiveStatus(courseSectionData[currentSectionIndex]?._id);
      //set current sub section
      setVideoBarActive(
        courseSectionData[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id
      );
      console.log(completedLectures);
    })();
  }, [courseSectionData, sectionId, subSectionId, location.pathname]);

  useEffect(() => {}, [completedLectures.length]);

  return (
    <div className="w-full md:w-64 p-4 bg-richblack-800 md:min-h-screen md:overflow-auto flex-shrink-0">
      <div className="my-10">
        {/* Back button and review button */}
        <div className="flex justify-between mb-4">
          <button onClick={() => navigate("/dashboard/enrolled-courses")}>
            Back
          </button>
          <IconBtn text={"Add Review"} onClick={() => setReviewModal(true)} />
        </div>

        {/* Display course name and completion progress */}
        <div className="mb-6">
          <p className="text-lg font-semibold">
            {courseEntireData?.courseName}
          </p>
          <p className="text-sm text-richblack-400">
            {completedLectures?.length || 0} / {totalNoOfLectures}
          </p>
        </div>
      </div>

      {/* Section and Subsection List */}
      <div className="space-y-3">
        {courseSectionData.map((section, index) => (
          <div key={index} className="space-y-1">
            {/* Section Header */}
            <div
              onClick={() => setActiveStatus(section?._id)}
              className="flex justify-between px-3 py-2 bg-richblack-700 rounded cursor-pointer"
            >
              <span>{section?.sectionName}</span>
              <IoIosArrowDown
                className={`transition-transform ${
                  activeStatus === section?._id ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Subsections List */}
            <div>
              {activeStatus === section?._id && (
                <div className="space-y-2">
                  {section.subSection.map((subsection, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        navigate(
                          `view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subsection?._id}`
                        );
                        setVideoBarActive(subsection?._id);
                      }}
                      className={`flex gap-4 p-5 ${
                        videoBarActive === subsection._id
                          ? "bg-yellow-200 text-richblack-900"
                          : "bg-black text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(subsection._id)}
                        onChange={() => {}}
                      />
                      <p>{subsection?.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailsSidebar;
