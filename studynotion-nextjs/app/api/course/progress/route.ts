import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import CourseProgress from "@/models/CourseProgress";
import SubSection from "@/models/SubSection";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Student");
    if ("error" in auth) return auth.error;

    const { courseId, subSectionId } = await req.json();
    const userId = auth.user.id;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return NextResponse.json(
        { success: false, error: "Invalid subsection" },
        { status: 404 }
      );
    }

    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
    }

    const alreadyCompleted = courseProgress.completedVideos.some(
      (id: unknown) => id?.toString() === subSectionId
    );
    if (alreadyCompleted) {
      return NextResponse.json(
        { success: false, message: "Subsection already completed" },
        { status: 400 }
      );
    }

    courseProgress.completedVideos.push(subSectionId);
    await courseProgress.save();

    return NextResponse.json(
      { success: true, message: "Course progress updated" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
