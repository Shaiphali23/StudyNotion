import React, { useEffect, useRef, useState } from "react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { FiUploadCloud } from "react-icons/fi";
import { useDropzone } from "react-dropzone";

const Upload = ({
  name,
  label,
  register,
  setValue,
  getValues,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) => {
  //   const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );
  const inputRef = useRef(null);

  // Combined drop handling logic
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewSource(reader.result);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4"] }
      : { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
  });

  useEffect(() => {
    register(name, { required: true });
    setValue(name, selectedFile);
  }, [register, setValue, selectedFile, name]);

  const handleCancel = () => {
    setPreviewSource("");
    setSelectedFile(null);
    setValue(name, null);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div>
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col w-full items-center p-6"
            {...getRootProps()}
          >
            <input ref={inputRef} {...getInputProps()} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and Drop an {!video ? "image" : "video"} or click to {""}
              <span className="font-semibold text-yellow-50">Browse</span> a
              file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default Upload;
