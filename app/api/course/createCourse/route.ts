import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import Category from "@/models/Category";
import Course from "@/models/Course";
import User from "@/models/User";

function parseArrayField(value: unknown): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch {
      return [value];
    }
  }
  return value;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const formData = await req.formData();
    const courseName = formData.get("courseName") as string | null;
    const courseDescription = formData.get("courseDescription") as string | null;
    const whatYouWillLearn = formData.get("whatYouWillLearn") as string | null;
    const price = formData.get("price") as string | null;
    const category = formData.get("category") as string | null;
    const tagRaw = formData.get("tag");
    const instructionsRaw = formData.get("instructions");
    const statusRaw = formData.get("status") as string | null;
    const thumbnailFile = formData.get("thumbnailImage") as unknown as File | null;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      tagRaw === null ||
      instructionsRaw === null
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!thumbnailFile || typeof thumbnailFile === "string") {
      return NextResponse.json(
        { success: false, message: "Thumbnail image is required" },
        { status: 400 }
      );
    }

    const userId = auth.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return NextResponse.json(
        { success: false, message: "Instructor not found" },
        { status: 401 }
      );
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return NextResponse.json(
        { success: false, message: "Invalid category" },
        { status: 401 }
      );
    }

    const bytes = Buffer.from(await thumbnailFile.arrayBuffer());
    const tmpPath = path.join(
      os.tmpdir(),
      `${Date.now()}-${thumbnailFile.name}`
    );
    await writeFile(tmpPath, bytes);
    const thumbnailImage = await uploadToCloudinary(
      tmpPath,
      process.env.FOLDER_NAME || "StudyNotion"
    );

    let status: string = statusRaw || "Draft";

    const tag = parseArrayField(
      typeof tagRaw === "string" ? tagRaw : (tagRaw as unknown)
    );
    const instructions = parseArrayField(
      typeof instructionsRaw === "string"
        ? instructionsRaw
        : (instructionsRaw as unknown)
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price: Number(price),
      category: categoryDetails._id,
      thumbnail: (thumbnailImage as unknown as { secure_url: string }).secure_url,
      tag: tag as unknown as string[],
      instructions: instructions as unknown as string[],
      status: status as "Draft" | "Published",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course created Successfully",
        course: newCourse,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while creating the course",
        error: message,
      },
      { status: 500 }
    );
  }
}
