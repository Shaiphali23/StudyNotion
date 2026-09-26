import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import razorpay from "@/lib/razorpay";
import mongoose from "mongoose";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireRole(req, "Student");
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    const { courses } = await req.json();

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide course Id" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    for (const course_id of courses) {
      let course;
      try {
        course = await Course.findById(course_id);
        if (!course) {
          return NextResponse.json(
            { success: false, message: "Could not find the course" },
            { status: 404 }
          );
        }

        const uid = new mongoose.Types.ObjectId(userId);
        const alreadyEnrolled = (course.studentsEnrolled || []).some(
          (id: unknown) => (id as mongoose.Types.ObjectId).toString() === uid.toString()
        );
        if (alreadyEnrolled) {
          return NextResponse.json(
            { success: false, message: "Student is already enrolled." },
            { status: 400 }
          );
        }

        totalAmount += course.price;
      } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
          { success: false, message },
          { status: 500 }
        );
      }
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random().toString(),
    };

    try {
      const paymentResponse = await razorpay.orders.create(options);
      return NextResponse.json(
        { success: true, data: paymentResponse },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Could not initiate order" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
