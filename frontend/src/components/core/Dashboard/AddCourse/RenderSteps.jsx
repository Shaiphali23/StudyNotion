import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import PublishCourse from "./PublishCourse";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];

  return (
    <>
      {/* Step Circles and Dashes */}
      <div className="flex justify-center items-center gap-6">
        {steps.map((item, i) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  step === item.id
                    ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                    : "border-richblack-100 bg-richblack-800 text-richblack-300"
                }`}
              >
                {step > item.id ? <FaCheck /> : item.id}
              </div>

              {/* Step Title */}
              <p className="mt-2 text-sm font-medium text-center">
                {item.title}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Conditionally render the step forms */}
      <div className="mt-8">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </>
  );
};

export default RenderSteps;
