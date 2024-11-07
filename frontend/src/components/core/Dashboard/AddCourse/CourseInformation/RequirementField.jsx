import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RequirementField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions);
    }
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  });

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  };

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-richblack-5 mb-2 text-sm"
      >
        {label}
        <sup className="text-pink-600">*</sup>
      </label>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter a requirement"
          className="bg-richblack-700 rounded-md p-2 w-full focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="bg-yellow-200 text-richblack-900 px-4 py-2 rounded-md focus:outline-none"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul className="list-disc list-inside space-y-2">
          {requirementList.map((requirement, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-[#ef4444] hover:text-[#b91c1c]"
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="text-[#ef4444] text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};

export default RequirementField;
