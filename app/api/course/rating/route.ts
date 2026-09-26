import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import mongoose from "mongoose";
import Course from "@/models/Course";
import RatingAndReview from "@/models/RatingAndReview";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Student");
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    const { courseId, rating, review } = await req.json();

    if (!courseId || !rating || !review) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID, rating, and review are required.",
        },
        { status: 400 }
      );
    }

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return NextResponse.json(
        { success: false, message: "Student is not enrolled in this course." },
        { status: 404 }
      );
    }

    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return NextResponse.json(
        {
          success: false,
          message: "Course is already reviewed by the user.",
        },
        { status: 403 }
      );
    }

    const newRatingAndReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });

    await Course.findByIdAndUpdate(
      courseId,
      { $push: { ratingAndReviews: newRatingAndReview._id } },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Rating and review created successfully.",
        ratingAndReview: newRatingAndReview,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 }
      );
    }

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return NextResponse.json(
        {
          success: true,
          averageRating: result[0].averageRating,
          message: "Average rating retrieved successfully.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Average rating is 0, no rating given till now.",
        averageRating: 0,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Error calculating the average rating.",
        error: message,
      },
      { status: 500 }
    );
  }
}
