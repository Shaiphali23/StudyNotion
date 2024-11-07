import React from "react";
import HighlightText from "../components/HomePage/HighlightText";
import BannerImg1 from "../assets/Images/aboutus1.webp";
import BannerImg2 from "../assets/Images/aboutus2.webp";
import BannerImg3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/StatsComponent";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Footer from "../components/common/Footer";
import ContactForm from "../components/ContactPage/ContactForm";

const About = () => {
  return (
    <div>
      {/* Section-1 */}
      <section className="py-8 lg:py-16 bg-richblack-800">
        <div className="max-w-screen-xl mx-auto mt-16 text-center px-6 text-white">
          <header className="mb-12">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {" "}
              Driving Innovation in Online Education for a{" "}
              <HighlightText text={"Brighter Future"} />
            </h1>
            <p className="text-md lg:text-lg text-richblack-100 leading-relaxed max-w-4xl mx-auto">
              StudyNotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <img
              src={BannerImg1}
              alt="Banner 1"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img
              src={BannerImg2}
              alt="Banner 2"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
            <img
              src={BannerImg3}
              alt="Banner 3"
              className="rounded-lg shadow-lg hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* Section-2 */}
      <section className="py-5 lg:py-10 bg-[#000814]">
        <div className="max-w-screen-xl text-white mx-auto p-4 md:p-8 lg:p-16 text-center">
          <Quote />
        </div>
      </section>

      {/* Section-3 */}
      <section className="py-10 lg:py-16 bg-[#000814]">
        <div className="max-w-screen-xl text-white flex flex-col mx-auto px-6 md:px-6 lg:px-16 gap-y-20">
          {/* Founding Story */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
            {/* left-box */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-3xl font-bold text-[#9F1A2B]">
                Our Founding Story
              </h1>
              <p className="leading-relaxed text-richblack-200">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="leading-relaxed text-richblack-200">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            {/* image */}
            <div>
              <img src={FoundingStory} alt="Founding Story" />
            </div>
          </div>

          {/* Vision and Mission */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
            {/* Vision */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-3xl font-bold text-[#EA7A08]">Our Vision</h1>
              <p className="leading-relaxed text-richblack-200">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>

            {/* Mission */}
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-3xl font-bold text-[#18BCFC]">Our Mission</h1>
              <p className="leading-relaxed text-richblack-200">
                our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section-4 */}
      <section className="bg-[#2C333F]">
        <div className="w-11/12 text-white mx-auto p-4 md:p-8 lg:p-16 text-center">
          <StatsComponent />
        </div>
      </section>

      {/* Section-5 */}
      <section className="bg-[#000814]">
        <div className="w-11/12 text-white mx-auto p-4 md:p-8 lg:p-16">
          <LearningGrid />
        </div>
      </section>

      {/* Contact Form */}
      <div className="w-full md:w-2/3 lg:w-1/2 mx-auto my-10 text-white p-4">
        <ContactForm />
      </div>

      {/* Footer section */}
      <section>
        <div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default About;
