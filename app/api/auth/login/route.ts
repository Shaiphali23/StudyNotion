import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 403 }
      );
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User is not registered, please sign up first" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Password is incorrect" },
        { status: 401 }
      );
    }

    const token = signToken({
      email: user.email,
      id: user._id.toString(),
      accountType: user.accountType,
    });

    // Remove password from user object
    const userObj = user.toObject();
    userObj.password = undefined as any;

    const response = NextResponse.json(
      { success: true, token, user: userObj, message: "User logged in successfully" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Login failed. " + message },
      { status: 500 }
    );
  }
}
