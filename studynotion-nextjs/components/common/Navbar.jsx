"use client";
import React, { useEffect, useState } from "react";
const Logo = "/assets/Logo/Logo-Full-Light.png";
import Link from "next/link";
import { NavbarLinks } from "../../data/navbar-links";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { MdOutlineShoppingCart } from "react-icons/md";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { FaAngleDown } from "react-icons/fa6";
import { categories } from "../../services/apis";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

const { CATEGORIES_API } = categories;

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", CATEGORIES_API);
      const categoryNames = result.data.categories.map((category) => ({
        title: category.name,
        path: `/catalog/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
      }));
      setSubLinks(categoryNames);
    } catch (error) {
      console.error("Error fetching categories list:", error);
    }
  };
  useEffect(() => {
    fetchSubLinks();
  }, []);

  const pathname = usePathname();
  const matchRoute = (route) => {
    return pathname === route;
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsCatalogOpen(false);
  };

  return (
    <div className="flex h-14 items-center justify-center border border-b-2 border-b-richblack-700">
      <div className="flex w-11/12 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <img
            src={Logo}
            loading="lazy"
            alt="Logo"
            className="w-[160px] h-[42px] lg:w-[200px] lg:h-[50px] object-contain"
          />
        </Link>

        {/* Mobile menu button */}
        <div className="lg:hidden flex justify-center items-center space-x-4">
          {/* Cart Icon */}
          {user && user?.accountType !== "Instructor" && (
            <Link href={"/dashboard/cart"}>
              <div className="relative inline-flex justify-center items-center">
                <MdOutlineShoppingCart className="text-2xl text-richblack-50" />
                {totalItems > 0 && (
                  <span className="absolute h-5 w-5 -top-2 -right-2 bg-[#ef3434] flex items-center justify-center rounded-full text-xs text-white font-semibold">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          )}

          {/* Profile Dropdown */}
          {token !== null && (
            <div className="">
              <ProfileDropDown />
            </div>
          )}

          <button
            className="text-richblack-100 text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Nav links */}
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden lg:flex"
          } flex-col lg:flex-row text-richblack-25 items-center gap-x-6 lg:relative lg:top-0 lg:left-0 absolute top-14 left-0 w-full lg:w-auto px-4 py-6 lg:px-0 lg:py-0 z-40 bg-richblack-800 lg:bg-transparent`}
        >
          <ul className="flex flex-col lg:flex-row gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, i) => {
              return (
                <li key={i}>
                  {link.title === "Catalog" ? (
                    <div className="relative flex flex-col lg:flex-row lg:items-center gap-2 group cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setIsCatalogOpen((prev) => !prev)}
                        className="flex items-center gap-2"
                        aria-expanded={isCatalogOpen}
                      >
                        <p>{link.title}</p>
                        <FaAngleDown
                          className={`transition-transform duration-200 ${
                            isCatalogOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Desktop dropdown on hover */}
                      <div className="absolute invisible mt-2 translate-x-[-30%] left-0 z-10 top-full hidden lg:flex flex-col rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                        {subLinks.length > 0 ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              onClick={handleLinkClick}
                              href={`${subLink.path}`}
                              key={i}
                              className="px-4 py-2 hover:bg-richblack-50 rounded-md m-1"
                            >
                              <p>{subLink.title}</p>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-2">No categories</div>
                        )}
                      </div>

                      {/* Mobile list shown after tapping Catalog */}
                      <div
                        className={`${
                          isCatalogOpen ? "flex" : "hidden"
                        } lg:hidden flex-col gap-1 pl-4 w-full`}
                      >
                        {subLinks.length > 0 ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              onClick={handleLinkClick}
                              href={`${subLink.path}`}
                              key={i}
                              className="py-2 text-richblack-100 hover:text-yellow-25"
                            >
                              <p>{subLink.title}</p>
                            </Link>
                          ))
                        ) : (
                          <div className="py-2 text-richblack-300">
                            No categories
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link href={link?.path} onClick={handleLinkClick}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Login/SignUp/Dashboard*/}
        <div className="hidden lg:flex gap-x-8 items-center">
          {!token ? (
            <>
              <Link href={"/login"}>
                <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md">
                  Login
                </button>
              </Link>
              <Link href={"/signup"}>
                <button className="border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md">
                  SignUp
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Cart Icon */}
              {user && user?.accountType !== "Instructor" && (
                <Link href={"/dashboard/cart"}>
                  <div className="relative inline-flex justify-center items-center">
                    <MdOutlineShoppingCart className="text-2xl text-richblack-50" />
                    {totalItems > 0 && (
                      <span className="absolute h-5 w-5 -top-2 -right-2 bg-[#ef3434] flex items-center justify-center rounded-full text-xs text-white font-semibold">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Link>
              )}

              {/* Profile Dropdown */}
              {token !== null && (
                <div className="">
                  <ProfileDropDown />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
