import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";
import { VscArrowLeft } from "react-icons/vsc";
import { VscArrowRight } from "react-icons/vsc";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (authLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} ref={sidebarRef} />
      {/* Toggle button for mobile view */}
      <button
        className="absolute top-4 left-4 z-50 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <VscArrowLeft size={24} />
        ) : (
          <VscArrowRight size={24} />
        )}
      </button>

      <div className="flex-grow flex flex-col items-center py-10 min-h-screen">
        <div className="w-11/12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
