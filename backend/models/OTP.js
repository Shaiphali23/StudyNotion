const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

//function to send email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email from StudyNotion",
      otp
    );
    console.log("Email send Successfully", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next(); //go to next middleware
});

module.exports = mongoose.model("OTP", OTPSchema);
