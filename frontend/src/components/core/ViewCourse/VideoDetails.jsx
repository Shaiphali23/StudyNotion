import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return;

      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses");
      } else {
        // all 3 fields are present
        const filteredSection = courseSectionData.find(
          (section) => section._id === sectionId
        );
        const filteredVideo = filteredSection?.subSection.find(
          (subsection) => subsection._id === subSectionId
        );
        setVideoData(filteredVideo || {});
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseEntireData, courseSectionData, location.pathname]);

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      {
        courseId: courseId,
        subSectionId: subSectionId,
      },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    } else {
      console.error("Failed to mark lecture as completed");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {!videoData ? (
        <div className="text-center text-richblack-700">No Data Found</div>
      ) : (
        <div className="w-full max-w-4xl p-6">
          {/* Video Player */}
          <Player
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData.videoUrl}
            className="w-full"
          >
            {/* mark as completed button */}
            {videoEnded && (
              <div>
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onClick={() => handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="mt-2 text-xl px-6 py-2 bg-yellow-100 text-richblack-900 rounded-lg hover:bg-yellow-200 shadow-md transition-all"
                  />
                )}
              </div>
            )}
          </Player>
        </div>
      )}

      {/* Video Title and Description */}
      <div className="p-6 mt-2">
        <h1 className="text-2xl font-semibold text-richblack-5">
          {videoData?.title}
        </h1>
        <p className="mt-2 text-richblack-200">{videoData?.description}</p>
      </div>
    </div>
  );
};

export default VideoDetails;
