const { instance } = require("../config/razorpay");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userId
  const { courses } = req.body;
  const userId = req.user.id;

  //validation of courseId and userId
  if (!courses || courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide course Id",
    });
  }

  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find the course",
        });
      }

      //Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.json({
          success: false,
          message: "Student is already enrolled.",
        });
      }

      totalAmount += course.price;
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //Create order options for Razorpay
  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);

    //Return successful response to the client
    return res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

//Verify the payment
exports.verifySignature = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  //Compare the (server signature) with the Razorpay signature
  if (expectedSignature === razorpay_signature) {
    //enroll the student
    await enrollStudents(courses, userId, res);

    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses or userId",
    });
  }

  for (const courseId of courses) {
    try {
      //find the course and enroll the student
      const enrolledCourses = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourses) {
        return res.status(400).json({
          success: false,
          message: "Course not found",
        });
      }

      //find the student add the courses to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );

      //send mail to the students
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourses.courseName}`,
        courseEnrollmentEmail(
          enrolledCourses.courseName,
          enrolledStudent.firstName
        )
      );
      console.log("Email Send Successfully", emailResponse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }

  try {
    //find the enrolled student
    const enrolledStudent = await User.findById(userId);
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
  } catch (error) {
    console.log("Error in sending mail", error);
    return res.status(500).json({
      success: false,
      message: "Could not send mail",
    });
  }
};
