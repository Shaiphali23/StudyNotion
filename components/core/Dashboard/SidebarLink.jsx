"use client";
import React from "react";
import * as Icons from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";


const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName] || Icons.VscSymbolMisc;
  const pathname = usePathname();

  const isActive = (route) => {
    if (!route || !pathname) return false;
    return pathname === route || pathname === `/${route}`;
  };
  const matchRoute = (route) => {
    return isActive(route) ? "bg-yellow-800 text-yellow-50" : "";
  };

  return (
    <div>
      <Link
        href={`/${link.path.replace(/^\//, "")}`}
        className={`relative flex items-center px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-yellow-400 transition-all duration-200 ${matchRoute(
          link.path
        )}`}
      >
        <span
          className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 transition-all duration-200 ${
            isActive(link.path) ? "opacity-100" : "opacity-0"
          }`}
        ></span>

        <div className="flex items-center gap-x-2">
          <Icon className="text-lg" />
          <span>{link.name}</span>
        </div>
      </Link>
    </div>
  );
};

export default SidebarLink;
