import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/HomePage/HighlightText";
import CTAButton from "../components/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/HomePage/CodeBlocks";
import TimelineSection from "../components/HomePage/TimelineSection";
import LearningLanguageSection from "../components/HomePage/LearningLanguageSection";
import InstructorSection from "../components/HomePage/InstructorSection";
import ExploreMore from "../components/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div>
      {/***** Section-1 *****/}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-[1200px]">
        {/* Become an Instructor Button */}
        <Link to="/signup">
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95">
            <div className="flex items-center gap-2 px-10 py-2 group-hover:bg-richblack-900 rounded-full transition-all duration-200">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Empower Your Future Heading */}
        <div className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold mt-8">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>

        {/* Subheading */}
        <div className="w-[90%] text-center text-sm md:text-md lg:text-lg text-richblack-300 mt-4 max-w-[700px]">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructor.
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-7 mt-8 justify-center">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton>Book a Demo</CTAButton>
        </div>

        {/* Video Section */}
        <div
          className="mt-14 mx-auto shadow-lg shadow-blue-200 max-w-[900px]"
          style={{ boxShadow: "20px 20px 0px 0px #fff" }}
        >
          <video muted loop autoPlay className="w-full h-auto">
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Blocks-1 */}
        <div className="lg:mt-12">
          <CodeBlocks
            position={"flex-col lg:flex-row"}
            heading={
              <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
                Unlock your <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              <div className="font-inter text-base md:text-lg">
                Our courses are designed and taught by industry experts who have
                years of experience in coding and are passionate about sharing
                their knowledge with you.
              </div>
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
            codeblock={`<!DOCTYPE html><html><head><title>Example</title><link rel="stylesheet" href="styles.css"></head><body><h1><a href="/">Header</a></h1><nav><a href="one/">One</a><a href="two/">Two</a><a href="three/">Three</a></nav></body></html>`}
            codeColor={"text-yellow-25"}
          />
        </div>

        {/* Code Blocks-2 */}
        <div className="lg:mt-12">
          <CodeBlocks
            position={"flex-col lg:flex-row-reverse"}
            heading={
              <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
                Start <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              <div className="font-inter text-base md:text-lg">
                "Go ahead, give it a try. Our hands-on learning environment
                means you'll be writing real code from your very first lesson."
              </div>
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
            codeblock={`<!DOCTYPE html><html><head><title>Example</title><link rel="stylesheet" href="styles.css"></head>`}
            codeColor={"text-yellow-25"}
          />
        </div>

        {/* Explore More Section */}
        <div className="hidden lg:block">
          <ExploreMore />
        </div>
      </div>

      {/***** Section-2 *****/}
      <div className="bg-pure-greys-5 text-richblack-700 py-12">
        {/* Background Section */}
        <div className="homepage_bg h-[250px] flex flex-col justify-center items-center bg-center">
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-7 text-white">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-3">
                Explore Full Catalog
                <FaArrowRight />
              </div>
            </CTAButton>

            <CTAButton active={false} linkto={"/signup"}>
              <div>Learn More</div>
            </CTAButton>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 mt-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Left Text Section */}
            <div className="md:w-[1/2] text-lg sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left font-semibold">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>

            {/* Right Info Section */}
            <div className="md:w-[1/2] flex flex-col gap-6 md:gap-10 items-center md:items-start">
              <div className="text-[16px] text-center md:text-left">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section */}
          <TimelineSection />

          {/* Learning Language Section */}
          <LearningLanguageSection />
        </div>
      </div>

      {/***** Section-3 *****/}
      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
        <h2 className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold mt-10">
          Review from other learners
        </h2>
        <ReviewSlider />
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
