import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
// Register referenced models so `populate()` works on cold starts.
// Without these, Mongoose throws MissingSchemaError and the
// course page is stuck on "loading...".
import "@/models/User";
import "@/models/Profile";
import "@/models/Category";
import "@/models/RatingAndReview";
import "@/models/Section";
import "@/models/SubSection";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { courseId } = await req.json();

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate("studentsEnrolled")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course details fetched successfully",
        courseDetails,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching course details",
        error: message,
      },
      { status: 500 }
    );
  }
}
