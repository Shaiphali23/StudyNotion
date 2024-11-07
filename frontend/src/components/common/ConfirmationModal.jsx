import React from "react";
import IconBtn from "./IconBtn";

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-white">
      <div className="bg-black rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{modalData.text1}</h2>
        <p className="text-gray-600 mb-6">{modalData.text2}</p>
        <div className="flex justify-between">
          <IconBtn onClick={modalData?.btn1Handler} text={modalData.btn1Text} />
          <button
            onClick={modalData?.btn2Handler}
            className="font-medium text-richblack-600"
          >{modalData.btn2Text}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
