import React from "react";
import HighlightText from "../../HomePage/HighlightText";

const Quote = () => {
  return (
    <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-inter font-semibold leading-relaxed sm:leading-loose break-words">
      We are passionate about revolutionizing the way we learn. Our innovative
      platform <HighlightText text={"combines technology"} />{" "}
      <span className="text-[#F09819]">expertise</span> , and community to
      create an{" "}
      <span className="text-[#F9D423]">
        unparalleled educational experience.
      </span>
    </div>
  );
};

export default Quote;
