import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";
import { mailSender } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authResult = requireAuth(req);
    if ("error" in authResult) return authResult.error;

    const { user: authUser } = authResult;
    const { oldPassword, newPassword } = await req.json();

    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: "Old password is incorrect" }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    const title = "Password update confirmation";
    const body = `
    <p>Hello ${user.firstName}</p>
    <p>Your password has been successfully updated.</p>
    <p>Best Regards,<br>StudyNotion Team</p>
    `;

    try {
      await mailSender(user.email, title, body);
    } catch (mailError) {
      console.error("Failed to send password update email:", mailError);
    }

    // Convert to plain object to remove password from response
    const userObj = user.toObject();
    userObj.password = undefined as any;

    return NextResponse.json(
      { success: true, message: "Password updated successfully and confirmation email sent", user: userObj },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Could not change the password. " + message },
      { status: 500 }
    );
  }
}
