import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RatingAndReview from "@/models/RatingAndReview";

export async function GET() {
  try {
    await connectDB();
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return NextResponse.json(
      {
        success: true,
        message: "All reviews fetched Successfully",
        data: allReviews,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching reviews. " + message,
      },
      { status: 500 }
    );
  }
}
