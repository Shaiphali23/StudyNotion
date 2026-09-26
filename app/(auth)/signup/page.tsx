"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Template from "@/components/core/Auth/Template";

export default function SignUpPage() {
  const router = useRouter();
  const { token } = useSelector((state: any) => state.auth);

  // OpenRoute behaviour: logged-in users go to their dashboard
  useEffect(() => {
    if (token) {
      router.replace("/dashboard/my-profile");
    }
  }, [token, router]);

  return (
    <>
      <Navbar />
      <Template
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image="/assets/Images/signup.webp"
        formType="signup"
      />
      <Footer />
    </>
  );
}
