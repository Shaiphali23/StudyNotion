"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLeftArrowAlt } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "@/services/operations/authAPI";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  // Services expect a navigate(path) callback; wrap router.push.
  const navigate = (path: string) => router.push(path);
  const dispatch: any = useDispatch();
  const { signUpData, loading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!signUpData) {
      router.replace("/signup");
    }
  }, [signUpData, router]);

  const handleVerifyAndSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData) return;
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
    } = signUpData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        contactNumber,
        otp,
        navigate
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="text-white flex justify-center items-center h-screen">
        {loading ? (
          <div className="text-xl font-semibold">Loading...</div>
        ) : (
          <div className="w-full max-w-md rounded-md shadow-lg bg-richblack-800 p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-2">Verify email</h1>
            <p className="text-richblack-100 mb-6">
              A verification code has been sent to you. Enter the code below
            </p>

            <form
              onSubmit={handleVerifyAndSignup}
              className="flex flex-col items-center"
            >
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="text-white px-1">-</span>}
                renderInput={(props: any) => (
                  <input
                    {...props}
                    className="w-12 h-12 lg:w-14 lg:h-14 text-center text-xl text-white rounded-md bg-richblack-600"
                    style={{
                      color: "white",
                      border: "none",
                      outline: "none",
                      padding: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              />
              <button
                type="submit"
                className="bg-[#FFD60A] mt-4 w-full py-2 rounded-md text-black font-semibold"
              >
                Verify Email
              </button>
            </form>

            <div className="flex justify-between items-center mt-6">
              <div>
                <Link href={"/login"} className="flex items-center gap-2">
                  <BiLeftArrowAlt fontSize={20} />
                  <p>Back to login</p>
                </Link>
              </div>

              <div>
                <button
                  className="flex items-center gap-1 text-[#47A5C5]"
                  onClick={() =>
                    signUpData &&
                    dispatch(sendOtp(signUpData.email, navigate))
                  }
                >
                  <GiBackwardTime fontSize={20} />
                  <p>Resend it</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
