import React from "react";

const HighlightText = ({ text }) => {
  return (
    <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[#46E6E9] font-inter">
      {text}
    </span>
  );
};

export default HighlightText;
