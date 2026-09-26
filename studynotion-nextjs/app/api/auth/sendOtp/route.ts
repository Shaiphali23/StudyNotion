import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import otpGenerator from "otp-generator";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email: rawEmail } = await req.json();

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("SEND OTP ERROR: missing MAIL_HOST/MAIL_USER/MAIL_PASS env vars");
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 400 },
      );
    }

    // Generate a unique OTP
    let otp: string;
    let result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    try {
      await OTP.create({ email, otp, expiresAt: otpExpiration });
    } catch (mailError) {
      console.error(`SEND OTP: email failed to ${email}:`, mailError);
      const detail = mailError instanceof Error ? mailError.message : "Unknown error";
      return NextResponse.json(
        {
          success: false,
          message: `Could not send OTP email to ${email}. ${detail}`,
        },
        { status: 500 }
      );
    }

    console.log(`OTP generated for ${email}`);
    return NextResponse.json(
      { success: true, message: `OTP sent successfully to ${email}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "OTP sending failed. " + message,
      },
      { status: 500 }
    );
  }
}
