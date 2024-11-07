import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-y-10 gap-x-5 text-white p-8">
        {/* Left Section - Course Form */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Add Course</h1>
          <div>
            <RenderSteps />
          </div>
        </div>

        {/* Right Section - Tips */}
        <div className="lg:w-1/3 lg:h-1/3 bg-richblack-800 p-6 rounded-lg shadow-lg">
          <p className="text-xl font-semibold mb-4">⚡Course Upload Tips</p>
          <ul className="list-disc list-inside space-y-3">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
