import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { firstName, lastName, email, countryCode, phoneNumber, message } =
      await req.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !countryCode ||
      !phoneNumber ||
      !message
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      message,
    });

    await newContact.save();
    return NextResponse.json(
      { success: true, message: "Contact Form Submitted Successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error saving contact form", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while submitting the form. " + message,
      },
      { status: 500 }
    );
  }
}
