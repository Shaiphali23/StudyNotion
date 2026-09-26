import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const instructorId = auth.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: instructorCourses },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve instructor courses",
        error: message,
      },
      { status: 500 }
    );
  }
}
