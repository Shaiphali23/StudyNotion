import React from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import { FooterLink2 } from "../../data/footer-links";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row flex-col gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Left Part */}
          <div className="lg:w-[50%] flex flex-wrap justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            {/* Company */}
            <div className="w-[30%] flex flex-col gap-3 mb-7 lg:pl-0">
              <img src={Logo} className="object-contain" alt="Company Logo" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((elem, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={elem.split(" ").join("-").toLocaleLowerCase()}>
                        {elem}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex text-lg gap-3">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>

            {/* Resources */}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((elem, i) => {
                  return (
                    <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                      <Link to={elem.split(" ").join("-").toLocaleLowerCase()}>
                        {elem}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Support
              </h1>

              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>

            {/* Plan & Community*/}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((elem, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={elem.split(" ").join("-").toLocaleLowerCase()}>
                        {elem}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((elem, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={elem.split(" ").join("-").toLocaleLowerCase()}>
                        {elem}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Part */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((elem, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px]">
                    {elem.title}
                  </h1>

                  <div className="flex flex-col gap-2 mt-2">
                    {elem.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* bottom section */}
      <div className="w-11/12 max-w-maxContent mx-auto pb-8 lg:pb-14 text-richblack-400 text-sm">
        {/* Links & Text */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 w-full">
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8">
            {BottomFooter.map((elem, i) => {
              return (
                <div
                  key={i}
                  className="cursor-pointer hover:text-richblack-50 transition-all duration-200"
                >
                  <Link to={elem.split(" ").join("-").toLocaleLowerCase()}>
                    {elem}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            Made with ❤️ © 2023 StudyNotion
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
