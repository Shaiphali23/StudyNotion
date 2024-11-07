import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";

const CoursesTable = ({ courses, setCourses }) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="text-white">
      <Table className="w-full text-left">
        <Thead className="bg-richblack-700">
          <Tr>
            <Th className="py-3 px-4 border-b border-gray-600">Courses</Th>
            <Th className="py-3 px-4 border-b border-gray-600">Duration</Th>
            <Th className="py-3 px-4 border-b border-gray-600">Price</Th>
            <Th className="py-3 px-4 border-b border-gray-600">Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td className="py-4">No courses found.</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr key={course._id} className="border-b border-richblack-700">
                <Td className="flex items-start gap-x-4 py-4">
                  <img
                    src={course?.thumbnail}
                    alt={course.courseName}
                    className="h-[150px] w-[220px] rounded-lg object-cover"
                  />

                  <div className="flex flex-col">
                    <p className="font-semibold">{course.courseName}</p>
                    <p>{course.courseDescription}</p>
                    <p>Created: </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="text-pink-200">DRAFTED</p>
                    ) : (
                      <p className="text-yellow-50">PUBLISHED</p>
                    )}
                  </div>
                </Td>

                <Td className="px-4 py-3">2hr 30min</Td>
                <Td className="px-4 py-3">${course.price}</Td>
                <Td className="py-3 px-4">
                  <button
                    disabled={loading}
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    className={`text-yellow-50 hover:text-yellow-100 transition`}
                  >
                    <MdModeEditOutline size={20} />
                  </button>

                  <button
                    disabled={loading}
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }
                    className="text-[#D11A2A]"
                  >
                    <RiDeleteBinLine size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CoursesTable;
