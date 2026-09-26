import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import Section from "@/models/Section";
import SubSection from "@/models/SubSection";

async function saveUpload(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const tmpPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
  await writeFile(tmpPath, bytes);
  return tmpPath;
}

type ParsedBody = {
  sectionId?: string;
  subSectionId?: string;
  title?: string;
  description?: string;
  videoFile: File | null;
};

async function parseBody(req: NextRequest): Promise<ParsedBody> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const getStr = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v : undefined;
    };
    const rawVideo = fd.get("videoFile") ?? fd.get("video") as unknown;
    const videoFile =
      rawVideo && typeof rawVideo !== "string"
        ? (rawVideo as File)
        : null;
    return {
      sectionId: getStr("sectionId"),
      subSectionId: getStr("subSectionId"),
      title: getStr("title"),
      description: getStr("description"),
      videoFile,
    };
  }
  try {
    const json = await req.json();
    return { ...json, videoFile: null };
  } catch {
    return { videoFile: null };
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const { sectionId, title, description, videoFile } = await parseBody(req);

    if (!sectionId || !title || !description || !videoFile) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const tmpPath = await saveUpload(videoFile);
    const uploadDetails = (await uploadToCloudinary(
      tmpPath,
      process.env.FOLDER_NAME || "StudyNotion"
    )) as unknown as { secure_url: string; duration?: number | string };

    const subSectionDetails = await SubSection.create({
      title,
      description,
      videoUrl: uploadDetails.secure_url,
      timeDuration: `${uploadDetails.duration ?? 0}`,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return NextResponse.json(
      {
        success: true,
        message: "Sub Section created Successfully",
        data: updatedSection,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error in createSubSection:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create sub section." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const { sectionId, subSectionId, title, description, videoFile } =
      await parseBody(req);

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return NextResponse.json(
        { success: false, message: "SubSection not found" },
        { status: 404 }
      );
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    if (videoFile && videoFile.size > 0) {
      const tmpPath = await saveUpload(videoFile);
      const uploadDetails = (await uploadToCloudinary(
        tmpPath,
        process.env.FOLDER_NAME || "StudyNotion"
      )) as unknown as { secure_url: string; duration?: number | string };
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration ?? subSection.timeDuration ?? 0}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Sub Section updated Successfully",
        data: updatedSection,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Unable to update sub section.",
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Instructor");
    if ("error" in auth) return auth.error;

    const { sectionId, subSectionId } = await parseBody(req);

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subSection: subSectionId } }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection) {
      return NextResponse.json(
        { success: false, message: "SubSection not found" },
        { status: 404 }
      );
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Sub Section deleted Successfully",
        data: updatedSection,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete sub section.",
        error: message,
      },
      { status: 500 }
    );
  }
}
