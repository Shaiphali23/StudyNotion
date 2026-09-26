import React from "react";
import * as Icon1 from "react-icons/bi";
import * as Icon3 from "react-icons/hi2";
import * as Icon2 from "react-icons/io5";

const ContactDetails = () => {
  const contactDetails = [
    {
      icon: "HiChatBubbleLeftRight",
      heading: "Chat on us",
      description: "Our friendly team is here to help.",
      details: "info@studynotion.com",
    },
    {
      icon: "BiWorld",
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details:
        "Akshay Nagari 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
    },
    {
      icon: "IoCall",
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7869",
    },
  ];
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-4 lg:p-6">
      {contactDetails.map((elem, i) => {
        let Icon = Icon1[elem.icon] || Icon2[elem.icon] || Icon3[elem.icon];
        return (
          <div key={i} className="flex gap-x-4">
            <div>
              <Icon size={25} className="text-richblack-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-richblack-5">
                {elem.heading}
              </h1>
              <p className="text-sm text-richblack-300">{elem.description}</p>
              <p className="text-sm text-richblack-300">{elem.details}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactDetails;
