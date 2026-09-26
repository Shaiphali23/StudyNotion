import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { mailSender } from "@/lib/mailer";
import crypto from "crypto";
import Course from "@/models/Course";
import User from "@/models/User";

function courseEnrollmentEmail(courseName: string, name: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Course Registration Confirmation</title></head><body><p>Dear ${name},</p><p>You have successfully registered for the course "${courseName}".</p><p>Please log in to your learning dashboard to access the course materials.</p></body></html>`;
}

async function enrollStudents(courses: string[], userId: string) {
  for (const courseId of courses) {
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      throw new Error("Course not found");
    }

    const enrolledStudent = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { courses: courseId } },
      { new: true }
    );

    if (enrolledStudent) {
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName || "",
          enrolledStudent.firstName
        )
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Student");
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return NextResponse.json(
        { success: false, message: "Payment Failed" },
        { status: 400 }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      try {
        await enrollStudents(courses, userId);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Enrollment failed";
        return NextResponse.json(
          { success: false, message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Payment Verified" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
