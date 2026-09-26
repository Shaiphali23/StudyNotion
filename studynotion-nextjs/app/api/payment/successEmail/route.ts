import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { mailSender } from "@/lib/mailer";
import User from "@/models/User";

function paymentSuccessEmail(
  name: string,
  amount: number | string,
  orderId: string,
  paymentId: string
) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payment Confirmation</title></head><body><p>Dear ${name},</p><p>We have received a payment of \u20B9${amount}.</p><p>Your Payment ID is <b>${paymentId}</b></p><p>Your Order ID is <b>${orderId}</b></p></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = requireAuth(req);
    if ("error" in auth) return auth.error;
    const userId = auth.user.id;

    const { orderId, paymentId, amount } = await req.json();

    if (!orderId || !paymentId || !amount || !userId) {
      return NextResponse.json(
        { success: false, message: "Please provide all the fields" },
        { status: 400 }
      );
    }

    try {
      const enrolledStudent = await User.findById(userId);
      if (!enrolledStudent) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName}`,
          amount / 100,
          orderId,
          paymentId
        )
      );
      return NextResponse.json(
        { success: true, message: "Payment success email sent" },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.log("Error in sending mail", error);
      return NextResponse.json(
        { success: false, message: "Could not send mail" },
        { status: 500 }
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
