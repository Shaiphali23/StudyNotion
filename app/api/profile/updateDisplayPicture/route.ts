import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    const formData = await req.formData();
    const raw = formData.get("displayPicture") ?? formData.get("image");
    if (!raw || typeof raw === "string") {
      return NextResponse.json(
        { success: false, message: "No display picture provided." },
        { status: 400 }
      );
    }
    const displayPicture = raw as File;

    const bytes = Buffer.from(await displayPicture.arrayBuffer());
    const tmpPath = path.join(
      os.tmpdir(),
      `${Date.now()}-${displayPicture.name}`
    );
    await writeFile(tmpPath, bytes);
    const uploadedImage = (await uploadToCloudinary(
      tmpPath,
      process.env.FOLDER_NAME || "StudyNotion"
    )) as unknown as { secure_url: string };

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: uploadedImage.secure_url },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Profile Image Updated successfully`,
        data: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update display picture.",
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
