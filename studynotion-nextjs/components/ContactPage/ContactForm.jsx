import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 rounded-xl p-5 lg:p-10">
      <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-10 font-semibold text-richblack-5">Got a Idea? We’ve got the skills. Let’s team up</h1>
      <p className="text-richblack-300 text-md mt-2">Tall us more about yourself and what you’re got in mind.</p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
