import mongoose, { Schema, Document, Model } from "mongoose";
import { mailSender } from "@/lib/mailer";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

function otpEmailTemplate(otp: string) {
  return `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
    <h2>StudyNotion Verification</h2>
    <p>Your OTP is:</p>
    <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${otp}</p>
    <p>This OTP is valid for 5 minutes.</p>
  </div>`;
}

async function sendVerificationEmail(email: string, otp: string) {
  try {
    await mailSender(
      email,
      "Verification email from StudyNotion",
      otpEmailTemplate(otp)
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

OTPSchema.pre("save", async function () {
  // Normalize: schema options already trim/lowercase, enforce here too
  // so " Test@Gmail.com " and "test@gmail.com" map to the same OTP thread.
  if (typeof this.email === "string") {
    this.email = this.email.trim().toLowerCase();
  }
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
});

const OTP: Model<IOTP> =
  mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
