import React from "react";
import ContactUsForm from "../../common/ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <h1 className="text-3xl font-bold">Get in Touch</h1>
      <p className="text-md text-richblack-200 py-2">We’d love to here for you, Please fill out this form.</p>
      <div>
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
