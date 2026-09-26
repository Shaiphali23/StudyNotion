import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Course from "@/models/Course";
import CourseProgress from "@/models/CourseProgress";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;

    const { courseId } = await req.json();
    const userId = auth.user.id;

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return NextResponse.json(
        { success: false, message: `Could not find course with id: ${courseId}` },
        { status: 400 }
      );
    }

    const courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          courseDetails,
          completedVideos: courseProgressCount?.completedVideos || [],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
