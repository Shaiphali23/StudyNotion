import React from "react";

const IconBtn = ({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type = "button",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`${customClasses}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default IconBtn;
