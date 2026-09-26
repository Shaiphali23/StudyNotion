import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    if (allCourses.length === 0) {
      return NextResponse.json(
        { success: false, message: "No courses found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "All courses data fetched Successfully",
        allCourses,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Cannot fetch course data", error: message },
      { status: 500 }
    );
  }
}
