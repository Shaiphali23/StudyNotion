import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Profile from "@/models/Profile";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;
    const id = auth.user.id;

    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } =
      await req.json();

    if (!dateOfBirth || !about || !contactNumber || !gender) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    if (!profileDetails) {
      return NextResponse.json(
        { success: false, message: "Profile not found." },
        { status: 404 }
      );
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // Persist name edits (profile form collects firstName/lastName too)
    if (typeof firstName === "string" && firstName.trim()) {
      userDetails.firstName = firstName.trim();
    }
    if (typeof lastName === "string" && lastName.trim()) {
      userDetails.lastName = lastName.trim();
    }
    await userDetails.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated Successfully",
        profileDetails,
        updatedUser: userDetails,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Unable to update profile", error: message },
      { status: 400 }
    );
  }
}
