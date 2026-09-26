import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;

    const courseDetails = await Course.find({ instructor: auth.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    return NextResponse.json({ courses: courseData }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
