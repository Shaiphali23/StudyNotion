import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { mailSender } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Your email is not registered with us." },
        { status: 404 }
      );
    }

    const token = crypto.randomUUID();

    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
      { new: true }
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/update-password/${token}`;

    try {
      await mailSender(
        email,
        "Password reset Link",
        `Password reset Link: ${url}`
      );
    } catch (mailError) {
      console.error("Failed to send reset email:", mailError);
      return NextResponse.json(
        { success: false, message: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully for password change" },
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
