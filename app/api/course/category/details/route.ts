import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
// Register referenced models so `populate()` works on cold starts.
// Without these imports Mongoose throws MissingSchemaError for
// "Course" / "User" / "RatingAndReview" and the route returns 500
// ("An error occurred while fetching category page details.").
import "@/models/Course";
import "@/models/User";
import "@/models/RatingAndReview";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category ID is required." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID." },
        { status: 400 }
      );
    }

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [{ path: "ratingAndReviews" }, { path: "instructor" }],
      })
      .exec();

    if (!selectedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    if (
      !selectedCategory.courses ||
      selectedCategory.courses.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "No courses found for the selected category.",
        },
        { status: 404 }
      );
    }

    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allCourses = allCategories.flatMap((c: any) => c.courses || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getSoldCount = (course: any) =>
      typeof course?.sold === "number"
        ? course.sold
        : Array.isArray(course?.studentsEnrolled)
          ? course.studentsEnrolled.length
          : 0;
    const mostSellingCourses = allCourses
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => getSoldCount(b) - getSoldCount(a))
      .slice(0, 10);

    return NextResponse.json(
      {
        success: true,
        message: "Category Page details retrieved successfully.",
        data: {
          selectedCategory,
          differentCategories,
          mostSellingCourses,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Category page details ERROR:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching category page details.",
        error: message,
      },
      { status: 500 }
    );
  }
}
