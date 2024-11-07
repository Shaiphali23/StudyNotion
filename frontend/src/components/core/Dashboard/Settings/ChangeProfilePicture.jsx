import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayPicture } from "../../../../services/operations/settingsAPI";
import IconBtn from "../../../common/IconBtn";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(user?.image || null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes("image")) {
        alert("Please select a valid image file.");
        return;
      }
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = async () => {
    if (!imageFile) {
      alert("No file selected.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("displayPicture", imageFile);

    try {
      dispatch(updateDisplayPicture(token, formData));
      setImageFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 md:p-8 text-richblack-5">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img
          src={previewSource}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-20 rounded-full border-2 border-gray-600 object-cover"
        />
        <div className="space-y-2">
          <p className="text-lg font-semibold">Change Profile Picture</p>
          <div className="flex flex-row gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
              aria-label="Select profile picture"
            />
            <button
              onClick={handleClick}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
              aria-label="Select profile picture"
            >
              Select
            </button>
            <IconBtn
              text={"Upload"}
              onClick={handleFileUpload}
              disabled={loading}
              customClasses="flex gap-2 justify-center items-center bg-yellow-100 px-2 rounded-md text-richblack-900"
            >
              <FiUpload className="text-lg text-richblack-900" />
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
