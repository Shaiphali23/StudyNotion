import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import Course from "@/models/Course";
import Section from "@/models/Section";
import SubSection from "@/models/SubSection";

async function getBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const json = await req.json();
    if (json && typeof json === "object") return json;
  } catch {
    // fall through to query params
  }
  const { searchParams } = new URL(req.url);
  const courseId =
    searchParams.get("courseId") || searchParams.get("id") || undefined;
  return courseId ? { courseId } : {};
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const { courseId } = await getBody(req);

    if (!courseId || typeof courseId !== "string") {
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

    const courseSections = (course.courseContent || []) as unknown[];
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection || [];
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);

    return NextResponse.json(
      { success: true, message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Server error", error: message },
      { status: 500 }
    );
  }
}
