import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { password, confirmPassword, token } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Both password fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const userDetails = await User.findOne({ token });
    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "Token is invalid" },
        { status: 401 }
      );
    }

    if (userDetails.resetPasswordExpires && new Date() > userDetails.resetPasswordExpires) {
      return NextResponse.json(
        { success: false, message: "Token has expired, please regenerate your token" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword, token: undefined, resetPasswordExpires: undefined },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Something went wrong while resetting the password. " + message },
      { status: 500 }
    );
  }
}
