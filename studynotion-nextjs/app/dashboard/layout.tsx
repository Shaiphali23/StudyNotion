"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SidebarComponent from "@/components/core/Dashboard/Sidebar";
import { VscArrowLeft } from "react-icons/vsc";
import { VscArrowRight } from "react-icons/vsc";

// Sidebar is an untyped JS component; treat as any so isOpen/ref pass through.
const Sidebar: any = SidebarComponent;

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { loading: authLoading, token } = useSelector(
    (state: any) => state.auth
  );
  const { loading: profileLoading } = useSelector(
    (state: any) => state.profile
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<any>(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // PrivateRoute behaviour: unauthenticated users go to login
  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [authLoading, token, router]);

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
        <div className="w-11/12">{children}</div>
      </div>
    </div>
  );
}
