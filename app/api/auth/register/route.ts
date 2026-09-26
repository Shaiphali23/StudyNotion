import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import Profile from "@/models/Profile";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp: rawOtp,
    } = await req.json();

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const otp = typeof rawOtp === "string" ? rawOtp.trim() : rawOtp;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 403 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Password and Confirm Password do not match" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User is already registered" },
        { status: 400 }
      );
    }

    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (recentOtp.length === 0 || recentOtp[0].otp !== otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    if (Date.now() > recentOtp[0].expiresAt.getTime()) {
      return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: undefined,
      dateOfBirth: undefined,
      about: undefined,
      contactNumber: contactNumber || undefined,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id as any,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    await OTP.deleteMany({ email });

    return NextResponse.json(
      { success: true, message: "User is registered Successfully", user },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "User registration failed. " + message },
      { status: 500 }
    );
  }
}
