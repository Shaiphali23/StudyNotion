import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import User from "@/models/User";
import CourseProgress from "@/models/CourseProgress";

function convertSecondsToDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userDetails: any = await User.findById({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .exec();

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: `Could not find user with id: ${userId}` },
        { status: 400 }
      );
    }

    if (!userDetails.courses || userDetails.courses.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "No enrolled courses found." },
        { status: 200 }
      );
    }

    userDetails = userDetails.toObject();

    for (const course of userDetails.courses) {
      let totalDurationInSeconds = 0;
      let subSectionLength = 0;

      for (const content of course.courseContent || []) {
        const subSectionDuration = (content.subSection || []).reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (acc: number, curr: any) =>
            acc + parseInt(curr.timeDuration || "0", 10),
          0
        );
        totalDurationInSeconds += subSectionDuration;
        subSectionLength += (content.subSection || []).length;
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      const courseProgressCount = await CourseProgress.findOne({
        courseId: course._id,
        userId: userId,
      });

      const completedVideos = courseProgressCount?.completedVideos.length || 0;

      if (subSectionLength === 0) {
        course.progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        course.progressPercentage =
          Math.round(
            (completedVideos / subSectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    return NextResponse.json(
      { success: true, data: userDetails.courses },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching enrolled courses:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching enrolled courses.",
        error: message,
      },
      { status: 500 }
    );
  }
}
