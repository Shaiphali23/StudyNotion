import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import Course from "@/models/Course";

async function parseBody(req: NextRequest): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: Record<string, any>;
  thumbnailFile: File | null;
}> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        updates[key] = value;
      }
    }
    const raw = formData.get("thumbnailImage") as unknown;
    const thumbnailFile =
      raw && typeof raw !== "string" ? (raw as File) : null;
    return { updates, thumbnailFile };
  }
  const updates = await req.json();
  return { updates, thumbnailFile: null };
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const { updates, thumbnailFile } = await parseBody(req);
    const { courseId } = updates;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    if (thumbnailFile && thumbnailFile.size > 0) {
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
      (course as unknown as Record<string, unknown>).thumbnail = (
        thumbnailImage as unknown as { secure_url: string }
      ).secure_url;
    }

    for (const key in updates) {
      if (
        Object.prototype.hasOwnProperty.call(updates, key) &&
        key !== "courseId"
      ) {
        if (key === "tag" || key === "instructions") {
          const val = updates[key];
          if (typeof val === "string") {
            try {
              (course as unknown as Record<string, unknown>)[key] =
                JSON.parse(val);
            } catch {
              (course as unknown as Record<string, unknown>)[key] = val;
            }
          } else {
            (course as unknown as Record<string, unknown>)[key] = val;
          }
        } else {
          (course as unknown as Record<string, unknown>)[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
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

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Error updating course", error: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
