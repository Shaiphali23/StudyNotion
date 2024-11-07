import React from "react";
import ContactDetails from "../components/ContactPage/ContactDetails";
import ContactForm from "../components/ContactPage/ContactForm";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Contact = () => {
  return (
    <div className="text-white">
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 lg:flex-row">
        <div>
          <ContactDetails />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold ">Reviews from other learners</h1>
        <ReviewSlider/>
      </div>

      <Footer/>
    </div>
  );
};

export default Contact;
